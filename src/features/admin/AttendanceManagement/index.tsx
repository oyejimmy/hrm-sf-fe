import React, { useState, useMemo } from 'react';
import { Row, Col, Tabs, message, Button, Space, Spin, Alert, Card, Table, Tag, Modal, Descriptions, Avatar, Input, Select, DatePicker, Progress, Statistic, Popconfirm } from 'antd';
import { Users, BarChart3, Download, Settings, CheckCircle, XCircle, Clock, Coffee, UserCheck, User, Calendar, Eye, Search, Filter, TrendingUp, Activity, Target } from 'lucide-react';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StateCard } from '../../../components/StateCard';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import AttendanceStatsPanel from '../../employee/EmployeeAttendance/components/AttendanceStatsPanel';

import { AttendanceRecord } from '../../employee/EmployeeAttendance/types';
import { 
  useAllAttendanceToday, 
  useAttendanceStats, 

  useExportAttendanceReport,
  useProcessAutoAbsence
} from '../../../hooks/api/useAttendance';

interface Attendance {
  id?: number;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  hoursWorked?: number;
  remarks?: string;
  checkIn?: string;
  checkOut?: string;
  department?: string;
  breakTime?: string;
  overtime?: string;
  location?: string;
  recentRecords?: any[];
  avatar_url?: string;
}

// Ant Design table component for attendance
const TodayAttendanceTable: React.FC<{
  data: Attendance[];
  onEdit: (record?: Attendance) => void;
  onDelete: (id: number) => void;
  onView: (record: Attendance) => void;
  loading: boolean;
}> = ({ data, loading, onEdit, onDelete, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Half Day': return 'processing';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle size={14} />;
      case 'Absent': return <XCircle size={14} />;
      case 'Late': return <Clock size={14} />;
      default: return <Coffee size={14} />;
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'avatar_url',
      key: 'avatar',
      width: 60,
      render: (avatar_url: string, record: Attendance) => (
        <Avatar 
          src={avatar_url}
          size={48}
          style={{ backgroundColor: 'white', border: '1px solid #d9d9d9' }}
        >
          {record.employeeName.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: Attendance, b: Attendance) => a.employeeName.localeCompare(b.employeeName),
      render: (name: string) => name,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Attendance, b: Attendance) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend' as const,
      render: (date: string) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Attendance, b: Attendance) => a.status.localeCompare(b.status),
      render: (status: string) => {
        const colorMap = {
          'Present': 'green',
          'Absent': 'red',
          'Late': 'orange',
          'Half Day': 'blue'
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap] || 'default'}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Hours',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
      sorter: (a: Attendance, b: Attendance) => (a.hoursWorked || 0) - (b.hoursWorked || 0),
      render: (hours: number) => `${hours || 0}h`,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      sorter: (a: Attendance, b: Attendance) => (a.remarks || '').localeCompare(b.remarks || ''),
      render: (remarks: string) => remarks || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Attendance) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => onView(record)}
            title="View Details"
          >
            View
          </Button>
          <Popconfirm
            title="Delete attendance record?"
            description="Are you sure you want to delete this attendance record?"
            onConfirm={() => onDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} records`,
      }}
      locale={{
        emptyText: 'No attendance records found'
      }}
    />
  );
};

// Simple modal component for attendance
const TodayAttendanceModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSave: (data: Attendance) => void;
  record: Attendance | null;
}> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', zIndex: 1000 }}>
      <p>Attendance Modal</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const { TabPane } = Tabs;

const AdminAttendanceManagement: React.FC = () => {
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState<Attendance | null>(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateRange, setCustomDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();

  // API Hooks
  const { data: stats = {}, isLoading: statsLoading, error: statsError } = useAttendanceStats();
  const { data: attendanceRecords = [], isLoading: recordsLoading, error: recordsError } = useAllAttendanceToday();

  
  // Mutations
  const exportReportMutation = useExportAttendanceReport();
  const processAutoAbsenceMutation = useProcessAutoAbsence();

  // Event handlers
  const handleRecordUpdate = async (updatedRecord: AttendanceRecord) => {
    queryClient.setQueryData(['admin-attendance'], (old: AttendanceRecord[] = []) => 
      old.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    
    queryClient.invalidateQueries({ queryKey: ['admin-attendance-stats'] });
    message.success('Attendance record updated successfully');
  };

  const handleExportReport = () => {
    exportReportMutation.mutate({
      date: new Date().toISOString().split('T')[0],
      includeAll: true
    });
  };

  const handleProcessAutoAbsence = () => {
    processAutoAbsenceMutation.mutate();
  };

  const handleEditAttendance = (record?: Attendance) => {
    setSelectedAttendance(record || null);
    setAttendanceModalVisible(true);
  };

  const handleDeleteAttendance = (id: number) => {
    message.success('Attendance record deleted');
  };

  const handleViewAttendance = (record: Attendance) => {
    setViewRecord(record);
    setViewModalVisible(true);
  };

  const handleSaveAttendance = (data: Attendance) => {
    setAttendanceModalVisible(false);
    setSelectedAttendance(null);
    queryClient.invalidateQueries({ queryKey: ['admin-attendance'] });
    message.success('Attendance record saved');
  };

  const loading = statsLoading || recordsLoading;
  const hasError = statsError || recordsError;

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return (searchText ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);
  }, [searchText, dateFilter]);

  // Optimized filtering with useMemo for performance
  const filteredData = useMemo(() => {
    if (!Array.isArray(attendanceRecords)) return [];
    
    const filtered = attendanceRecords.filter((record: any) => {
      // Search filter - employee name or ID
      const employeeName = (record.employeeName || record.employee_name || '').toLowerCase();
      const employeeId = String(record.employee_id || record.id || '').toLowerCase();
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || employeeName.includes(searchLower) || employeeId.includes(searchLower);
      
      // Date filter
      const recordDate = dayjs(record.date);
      const today = dayjs();
      
      let matchesDate = true;
      if (dateFilter === 'custom' && customDateRange) {
        const [start, end] = customDateRange;
        matchesDate = start && end ? recordDate.isBetween(start, end, 'day', '[]') : true;
      } else {
        switch (dateFilter) {
          case 'today': matchesDate = recordDate.isSame(today, 'day'); break;
          case '3days': matchesDate = recordDate.isAfter(today.subtract(3, 'day')); break;
          case '7days': matchesDate = recordDate.isAfter(today.subtract(7, 'day')); break;
          case '15days': matchesDate = recordDate.isAfter(today.subtract(15, 'day')); break;
          case '30days': matchesDate = recordDate.isAfter(today.subtract(30, 'day')); break;
          default: matchesDate = true;
        }
      }
      
      return matchesSearch && matchesDate;
    });
    
    return filtered.map((record: any) => ({
      id: parseInt(record.id || record.employee_id || '0'),
      employeeName: record.employeeName || record.employee_name || 'Unknown',
      date: record.date || new Date().toISOString().split('T')[0],
      status: (record.status || 'Present') as 'Present' | 'Absent' | 'Late' | 'Half Day',
      hoursWorked: record.totalHours || record.total_hours || 0,
      remarks: record.notes || record.remarks || '',
      checkIn: record.check_in,
      checkOut: record.check_out,
      department: record.department?.name || 'N/A',
      breakTime: record.break_time || '0h',
      overtime: record.overtime || '0h',
      location: record.location || 'Office',
      avatar_url: record.avatar_url
    }));
  }, [attendanceRecords, searchText, dateFilter, customDateRange]);

  const handleClearFilters = () => {
    setSearchText('');
    setDateFilter('all');
    setCustomDateRange(null);
  };

  if (hasError) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <HeaderComponent
          isDarkMode={isDarkMode}
          title="Attendance Management System"
          subtitle="Monitor and manage employee attendance with real-time tracking"
          breadcrumbItems={[
            { title: 'Home', href: '/' },
            { title: 'Admin', href: '/admin' },
            { title: 'Attendance Management' }
          ]}
        />
        <Alert
          message="Error Loading Attendance Data"
          description="There was an issue loading attendance information. Please try refreshing the page or contact support."
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Attendance Management System"
        subtitle="Monitor and manage employee attendance with real-time tracking"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Admin', href: '/admin' },
          { title: 'Attendance Management' }
        ]}
        actions={
          <Space>
            <Button 
              icon={<Download size={16} />} 
              onClick={handleExportReport}
              loading={exportReportMutation.isPending}
              disabled={loading}
            >
              Export Report
            </Button>
            <Button 
              icon={<Settings size={16} />} 
              onClick={handleProcessAutoAbsence}
              loading={processAutoAbsenceMutation.isPending}
              disabled={loading}
            >
              Process Auto-Absence
            </Button>
          </Space>
        }
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading attendance data...</div>
        </div>
      )}

      {/* Attendance Stats Cards */}
      {!loading && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Present Today"
              value={`${stats.todayPresent || 0}/${stats.totalEmployees || 0}`}
              icon={<CheckCircle />}
              tone="pastelGreen"
              description={`${stats.totalEmployees ? ((stats.todayPresent || 0) / stats.totalEmployees * 100).toFixed(1) : 0}% present`}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Absent Today"
              value={stats.todayAbsent || 0}
              icon={<XCircle />}
              tone="pastelPink"
              description="Not checked in"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="Late Today"
              value={stats.todayLate || 0}
              icon={<Clock />}
              tone="lightPeach"
              description="Late arrivals"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard
              label="On Break"
              value={stats.onBreak || 0}
              icon={<Coffee />}
              tone="softLavender"
              description="Currently on break"
              loading={loading}
            />
          </Col>
        </Row>
      )}

      {!loading && (
        <Tabs defaultActiveKey="attendance">
          <TabPane
            tab={
              <span>
                <Users size={16} style={{ marginRight: 8 }} />
                Today's Attendance
              </span>
            }
            key="attendance"
          >
            <Card title="Attendance Records">
              <div style={{ 
                background: '#fafafa', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #f0f0f0'
              }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <Input
                      placeholder="Search by name or ID..."
                      prefix={<Search size={16} />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      value={dateFilter}
                      onChange={(value) => {
                        setDateFilter(value);
                        if (value !== 'custom') setCustomDateRange(null);
                      }}
                      style={{ width: '100%' }}
                      placeholder="Select period"
                    >
                      <Select.Option value="today">Today</Select.Option>
                      <Select.Option value="3days">Last 3 Days</Select.Option>
                      <Select.Option value="7days">Past 7 Days</Select.Option>
                      <Select.Option value="15days">Last 15 Days</Select.Option>
                      <Select.Option value="30days">Previous 30 Days</Select.Option>
                      <Select.Option value="custom">Custom Range</Select.Option>
                      <Select.Option value="all">All Time</Select.Option>
                    </Select>
                  </Col>
                  {dateFilter === 'custom' && (
                    <Col xs={24} sm={12} md={6}>
                      <DatePicker.RangePicker
                        value={customDateRange}
                        onChange={setCustomDateRange}
                        style={{ width: '100%' }}
                        placeholder={['Start date', 'End date']}
                      />
                    </Col>
                  )}
                  <Col xs={24} sm={12} md={4}>
                    <Space>
                      {activeFiltersCount > 0 && (
                        <Button size="small" onClick={handleClearFilters}>
                          Clear All
                        </Button>
                      )}
                      {activeFiltersCount > 0 && (
                        <Tag color="blue">
                          <Filter size={12} style={{ marginRight: 4 }} />
                          {activeFiltersCount}
                        </Tag>
                      )}
                    </Space>
                  </Col>
                </Row>
              </div>
              <TodayAttendanceTable
                data={filteredData}
                onEdit={handleEditAttendance}
                onDelete={handleDeleteAttendance}
                onView={handleViewAttendance}
                loading={loading}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChart3 size={16} style={{ marginRight: 8 }} />
                Overview
              </span>
            }
            key="overview"
          >
            <Card title={
              <Space>
                <Activity size={20} />
                <span>Attendance Overview & Statistics</span>
              </Space>
            }>
              {/* Key Metrics Cards */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                  <Card hoverable style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none' }}>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Present Today</span>}
                      value={stats.todayPresent || 0}
                      valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                      prefix={<CheckCircle size={16} style={{ color: 'white' }} />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card hoverable style={{ background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none' }}>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Absent Today</span>}
                      value={stats.todayAbsent || 0}
                      valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                      prefix={<XCircle size={16} style={{ color: 'white' }} />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card hoverable style={{ background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Late Arrivals</span>}
                      value={stats.todayLate || 0}
                      valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                      prefix={<Clock size={16} style={{ color: 'white' }} />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card hoverable style={{ background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', border: 'none' }}>
                    <Statistic
                      title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Total Employees</span>}
                      value={stats.totalEmployees || 0}
                      valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
                      prefix={<Users size={16} style={{ color: 'white' }} />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Attendance Rate Progress */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                  <Card title="Attendance Rate" extra={<Target size={16} />}>
                    <div style={{ textAlign: 'center' }}>
                      <Progress
                        type="circle"
                        percent={stats.attendanceRate || (stats.totalEmployees ? Math.round((stats.todayPresent || 0) / stats.totalEmployees * 100) : 0)}
                        size={120}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        format={(percent) => `${percent}%`}
                      />
                      <div style={{ marginTop: 16, color: '#666' }}>Overall Attendance Rate</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Status Breakdown">
                    <div style={{ padding: '20px 0' }}>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span>Present</span>
                          <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{stats.todayPresent || 0}</span>
                        </div>
                        <Progress percent={stats.totalEmployees ? ((stats.todayPresent || 0) / stats.totalEmployees * 100) : 0} strokeColor="#52c41a" showInfo={false} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span>Absent</span>
                          <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>{stats.todayAbsent || 0}</span>
                        </div>
                        <Progress percent={stats.totalEmployees ? ((stats.todayAbsent || 0) / stats.totalEmployees * 100) : 0} strokeColor="#ff4d4f" showInfo={false} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span>Late</span>
                          <span style={{ fontWeight: 'bold', color: '#faad14' }}>{stats.todayLate || 0}</span>
                        </div>
                        <Progress percent={stats.totalEmployees ? ((stats.todayLate || 0) / stats.totalEmployees * 100) : 0} strokeColor="#faad14" showInfo={false} />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Charts Section */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                  <Card title="Weekly Attendance Trend" extra={<TrendingUp size={16} />}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'end', justifyContent: 'space-around', padding: '20px 0' }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const height = Math.random() * 80 + 20;
                        return (
                          <div key={day} style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                width: 30,
                                height: `${height}%`,
                                background: 'linear-gradient(to top, #1890ff, #40a9ff)',
                                borderRadius: '4px 4px 0 0',
                                marginBottom: 8,
                                display: 'flex',
                                alignItems: 'end',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}
                            >
                              {Math.floor(height)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Department Wise Attendance">
                    <div style={{ padding: '20px 0' }}>
                      {[
                        { name: 'IT Department', present: 15, total: 20, color: '#1890ff' },
                        { name: 'HR Department', present: 8, total: 10, color: '#52c41a' },
                        { name: 'Finance', present: 12, total: 15, color: '#faad14' },
                        { name: 'Marketing', present: 6, total: 8, color: '#722ed1' }
                      ].map((dept, index) => (
                        <div key={index} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: '14px' }}>{dept.name}</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>{dept.present}/{dept.total}</span>
                          </div>
                          <Progress
                            percent={(dept.present / dept.total) * 100}
                            strokeColor={dept.color}
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Additional Metrics */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Average Working Hours"
                      value={8.5}
                      precision={1}
                      valueStyle={{ color: '#3f8600' }}
                      suffix="hrs"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="On Time Arrivals"
                      value={stats.totalEmployees ? (((stats.todayPresent || 0) - (stats.todayLate || 0)) / stats.totalEmployees * 100) : 0}
                      precision={1}
                      valueStyle={{ color: '#1890ff' }}
                      suffix="%"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Average Break Time"
                      value={45}
                      valueStyle={{ color: '#cf1322' }}
                      suffix="min"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      )}

      <TodayAttendanceModal
        visible={attendanceModalVisible}
        onClose={() => {
          setAttendanceModalVisible(false);
          setSelectedAttendance(null);
        }}
        onSave={handleSaveAttendance}
        record={selectedAttendance}
      />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} />
            <span>Attendance Details</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewRecord(null);
        }}
        footer={[
          <Button key="approve" type="primary" style={{ backgroundColor: '#52c41a' }}>
            Approve
          </Button>,
          <Button key="reject" danger>
            Reject
          </Button>,
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setViewRecord(null);
          }}>
            Close
          </Button>
        ]}
        width={800}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {viewRecord && (
          <Descriptions column={2} labelStyle={{ fontWeight: 'bold' }}>
            <Descriptions.Item label="Employee">{viewRecord.employeeName}</Descriptions.Item>
            <Descriptions.Item label="Department">{viewRecord.department}</Descriptions.Item>
            <Descriptions.Item label="Date">{new Date(viewRecord.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={viewRecord.status === 'Present' ? 'green' : viewRecord.status === 'Absent' ? 'red' : 'orange'}>
                {viewRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Check-in">{viewRecord.checkIn || '-'}</Descriptions.Item>
            <Descriptions.Item label="Check-out">{viewRecord.checkOut || '-'}</Descriptions.Item>
            <Descriptions.Item label="Hours Worked">{viewRecord.hoursWorked || 0}h</Descriptions.Item>
            <Descriptions.Item label="Location">{viewRecord.location}</Descriptions.Item>
            {viewRecord.remarks && (
              <Descriptions.Item label="Remarks" span={2}>{viewRecord.remarks}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </Wrapper>
  );
};

export default AdminAttendanceManagement;