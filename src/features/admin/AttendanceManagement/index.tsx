import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Button, DatePicker, Select, Tag, Space, Tooltip, Input } from 'antd';
import { Clock, Users, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { StateCard } from '../../../components/StateCard';
import { useAllAttendanceToday, useAttendanceStats, AttendanceRecord } from '../../../hooks/api/useAttendance';
import { useEmployees } from '../../../hooks/api/useEmployees';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { CsvIcon, ExcelIcon } from '../../../components/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const AttendanceManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [employeeFilter, setEmployeeFilter] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');

  const { data: employees = [] } = useEmployees();
  const { data: attendanceRecords = [], isLoading } = useAllAttendanceToday();
  const { data: stats } = useAttendanceStats();

  const filteredData = useMemo(() => {
    let filtered = attendanceRecords;

    if (statusFilter) {
      filtered = filtered.filter((record: AttendanceRecord) => record.status === statusFilter);
    }

    if (employeeFilter) {
      filtered = filtered.filter((record: any) => 
        (record.employeeId || record.employee_id) === employeeFilter.toString()
      );
    }

    if (searchText) {
      filtered = filtered.filter((record: any) =>
        (record.employeeName || record.employee_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (record.employeeId || record.employee_id || '').toString().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  }, [attendanceRecords, statusFilter, employeeFilter, searchText]);

  const displayStats = useMemo(() => {
    if (stats) {
      return {
        present: stats.todayPresent || 0,
        absent: stats.todayAbsent || 0,
        late: stats.todayLate || 0,
        onLeave: 0,
      };
    }
    
    // Fallback calculation from records
    const todayRecords = attendanceRecords.filter((record: any) => 
      record.date === dayjs().format('YYYY-MM-DD')
    );
    
    return {
      present: todayRecords.filter((r: any) => r.status === 'present').length,
      absent: todayRecords.filter((r: any) => r.status === 'absent').length,
      late: todayRecords.filter((r: any) => r.status === 'late').length,
      onLeave: 0,
    };
  }, [attendanceRecords, stats]);

  const exportToCSV = () => {
    const dataToExport = filteredData.map((record: any) => ({
      'Employee ID': record.employeeId || record.employee_id,
      'Employee Name': record.employeeName || record.employee_name,
      'Date': dayjs(record.date).format('DD/MM/YYYY'),
      'Check In': record.checkIn || record.check_in || '-',
      'Check Out': record.checkOut || record.check_out || '-',
      'Hours Worked': record.totalHours || record.total_hours || 0,
      'Status': record.status,
      'Notes': record.notes || '-'
    }));
    
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const dataToExport = filteredData.map((record: any) => ({
      'Employee ID': record.employeeId || record.employee_id,
      'Employee Name': record.employeeName || record.employee_name,
      'Date': dayjs(record.date).format('DD/MM/YYYY'),
      'Check In': record.checkIn || record.check_in || '-',
      'Check Out': record.checkOut || record.check_out || '-',
      'Hours Worked': record.totalHours || record.total_hours || 0,
      'Status': record.status,
      'Notes': record.notes || '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendance_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (name: string, record: any) => (
        <div>
          <div>{name || 'Unknown'}</div>
          <small style={{ color: '#666' }}>ID: {record.employeeId}</small>
        </div>
      ),
      sorter: (a: any, b: any) => 
        (a.employeeName || '').localeCompare(b.employeeName || ''),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => 
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (time: string) => time ? (time.includes(':') ? time : dayjs(time).format('HH:mm')) : '-',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (time: string) => time ? (time.includes(':') ? time : dayjs(time).format('HH:mm')) : '-',
    },
    {
      title: 'Hours Worked',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours: number) => hours ? `${hours.toFixed(1)}h` : '-',
      sorter: (a: any, b: any) => 
        (a.totalHours || 0) - (b.totalHours || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          present: { color: 'green', text: 'Present' },
          absent: { color: 'red', text: 'Absent' },
          late: { color: 'orange', text: 'Late' },
          half_day: { color: 'blue', text: 'Half Day' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config?.color}>{config?.text || status}</Tag>;
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-',
    },
  ];

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Attendance Management"
        subtitle="Monitor and manage employee attendance records"
        breadcrumbItems={[
          { title: "Home", href: "/" },
          { title: "Attendance" },
        ]}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Present Today"
            value={displayStats.present}
            icon={<UserCheck />}
            tone="pastelGreen"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Absent Today"
            value={displayStats.absent}
            icon={<UserX />}
            tone="lightPeach"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Late Arrivals"
            value={displayStats.late}
            icon={<AlertCircle />}
            tone="softLavender"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="On Leave"
            value={displayStats.onLeave}
            icon={<Clock />}
            tone="pastelBlue"
            loading={isLoading}
          />
        </Col>
      </Row>

      <Card
        title="Attendance Records"
        extra={
          <Space>
            <Search
              placeholder="Search employees..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Tooltip title="Export to CSV">
              <Button type="text" icon={<CsvIcon size={20} />} onClick={exportToCSV} />
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button type="text" icon={<ExcelIcon size={20} />} onClick={exportToExcel} />
            </Tooltip>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
          />
          <Select
            placeholder="Filter by Status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Option value="present">Present</Option>
            <Option value="absent">Absent</Option>
            <Option value="late">Late</Option>
            <Option value="half_day">Half Day</Option>

          </Select>
          <Select
            placeholder="Filter by Employee"
            value={employeeFilter}
            onChange={setEmployeeFilter}
            allowClear
            style={{ width: 200 }}
            showSearch
            filterOption={(input, option) =>
              String(option?.children || '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {employees.map((emp: any) => (
              <Option key={emp.id} value={emp.id}>{emp.name}</Option>
            ))}
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </Wrapper>
  );
};

export default AttendanceManagement;