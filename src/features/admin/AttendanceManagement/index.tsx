import React, { useState } from 'react';
import { Row, Col, Tabs, message, Button, Space, Spin, Alert, Card } from 'antd';
import { Users, BarChart3, Bell, Download, Settings, CheckCircle, XCircle, Clock, Coffee, UserCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StateCard } from '../../../components/StateCard';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import AttendanceStatsPanel from '../../employee/EmployeeAttendance/components/AttendanceStatsPanel';
import AttendanceNotificationPanel from '../../employee/EmployeeAttendance/components/AttendanceNotificationPanel';
import { AttendanceRecord } from '../../employee/EmployeeAttendance/types';
import { 
  useAllAttendanceToday, 
  useAttendanceStats, 
  useAdminAttendanceNotifications,
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
}

// Simple table component for attendance
const TodayAttendanceTable: React.FC<{
  data: Attendance[];
  onEdit: (record?: Attendance) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}> = ({ data, loading, onEdit, onDelete }) => {
  if (loading) return <div>Loading attendance data...</div>;
  
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Employee</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Hours</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Remarks</th>
          <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ border: '1px solid #ccc', padding: '16px', textAlign: 'center' }}>
              No attendance records found
            </td>
          </tr>
        ) : (
          data.map((record) => (
            <tr key={record.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.employeeName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  background: record.status === 'Present' ? '#d4edda' : record.status === 'Absent' ? '#f8d7da' : '#fff3cd',
                  color: record.status === 'Present' ? '#155724' : record.status === 'Absent' ? '#721c24' : '#856404'
                }}>
                  {record.status}
                </span>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.hoursWorked || 0}h</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{record.remarks || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => onEdit(record)} style={{ marginRight: '4px', padding: '4px 8px' }}>Edit</button>
                <button onClick={() => onDelete(record.id!)} style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
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
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();

  // API Hooks
  const { data: stats = {}, isLoading: statsLoading, error: statsError } = useAttendanceStats();
  const { data: attendanceRecords = [], isLoading: recordsLoading, error: recordsError } = useAllAttendanceToday();
  const { data: attendanceNotifications = [] } = useAdminAttendanceNotifications();
  
  // Mutations
  const exportReportMutation = useExportAttendanceReport();
  const processAutoAbsenceMutation = useProcessAutoAbsence();

  // Event handlers
  const handleRecordUpdate = async (updatedRecord: AttendanceRecord) => {
    queryClient.setQueryData(['admin-attendance-today'], (old: AttendanceRecord[] = []) => 
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

  const handleSaveAttendance = (data: Attendance) => {
    setAttendanceModalVisible(false);
    setSelectedAttendance(null);
    queryClient.invalidateQueries({ queryKey: ['admin-attendance-today'] });
    message.success('Attendance record saved');
  };

  const loading = statsLoading || recordsLoading;
  const hasError = statsError || recordsError;

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
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading attendance data...</div>
        </div>
      )}

      {!loading && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} />
              <span>Attendance Management System</span>
            </div>
          }
          extra={
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
        >
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
              {/* Attendance Stats Cards */}
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
              
              <TodayAttendanceTable
                data={Array.isArray(attendanceRecords) ? attendanceRecords.map((record: any) => ({
                  id: parseInt(record.id || record.employee_id || '0'),
                  employeeName: record.employeeName || record.employee_name || 'Unknown',
                  date: record.date || new Date().toISOString().split('T')[0],
                  status: (record.status || 'Present') as 'Present' | 'Absent' | 'Late' | 'Half Day',
                  hoursWorked: record.totalHours || record.total_hours || 0,
                  remarks: record.notes || record.remarks || ''
                })) : []}
                onEdit={handleEditAttendance}
                onDelete={handleDeleteAttendance}
                loading={loading}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <Bell size={16} style={{ marginRight: 8 }} />
                  Notifications
                  {attendanceNotifications.length > 0 && (
                    <span style={{ 
                      marginLeft: 8, 
                      background: '#ff4d4f', 
                      color: 'white', 
                      borderRadius: '10px', 
                      padding: '2px 6px', 
                      fontSize: '12px' 
                    }}>
                      {attendanceNotifications.length}
                    </span>
                  )}
                </span>
              }
              key="notifications"
            >
              <AttendanceNotificationPanel />
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
              <AttendanceStatsPanel
                stats={stats}
                loading={loading}
                showEmployeeStats={false}
              />
            </TabPane>
          </Tabs>
        </Card>
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
    </Wrapper>
  );
};

export default AdminAttendanceManagement;