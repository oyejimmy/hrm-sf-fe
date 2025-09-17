import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, message, Button, Space } from 'antd';
import { Users, BarChart3, Bell, Download, Settings } from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import AttendanceStatsPanel from '../../employee/EmployeeAttendance/components/AttendanceStatsPanel';
import AttendanceHistoryTable from '../../employee/EmployeeAttendance/components/AttendanceHistoryTable';
import AttendanceNotificationPanel from '../../employee/EmployeeAttendance/components/AttendanceNotificationPanel';
import { 
  AttendanceRecord, 
  AttendanceNotification, 
  AttendanceStats 
} from '../../employee/EmployeeAttendance/types';
import { attendanceApi } from '../../../services/api/attendanceApi';

const { TabPane } = Tabs;

// Mock data for admin view
const mockAdminStats: AttendanceStats = {
  todayPresent: 45,
  todayAbsent: 8,
  todayLate: 5,
  onBreak: 12,
  totalEmployees: 58
};

const mockAllAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2024-01-15',
    checkIn: '2024-01-15T09:15:00Z',
    checkOut: '2024-01-15T18:00:00Z',
    breakStart: '2024-01-15T12:00:00Z',
    breakEnd: '2024-01-15T13:00:00Z',
    totalHours: 8.75,
    breakMinutes: 60,
    workingHours: 7.75,
    status: 'Late',
    notes: 'Traffic delay'
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    department: 'Marketing',
    date: '2024-01-15',
    checkIn: '2024-01-15T09:00:00Z',
    checkOut: '2024-01-15T17:30:00Z',
    breakStart: '2024-01-15T12:30:00Z',
    breakEnd: '2024-01-15T13:30:00Z',
    totalHours: 8.5,
    breakMinutes: 60,
    workingHours: 7.5,
    status: 'Present'
  },
  {
    id: '3',
    employeeId: 'emp3',
    employeeName: 'Mike Johnson',
    department: 'Sales',
    date: '2024-01-15',
    checkIn: undefined,
    checkOut: undefined,
    totalHours: 0,
    breakMinutes: 0,
    workingHours: 0,
    status: 'Absent',
    notes: 'Sick leave'
  }
];

const mockAdminNotifications: AttendanceNotification[] = [
  {
    id: '1',
    type: 'late_arrival',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    department: 'Engineering',
    message: 'John Doe checked in late at 9:15 AM (15 minutes late)',
    timestamp: '30 minutes ago',
    read: false,
    priority: 'medium'
  },
  {
    id: '2',
    type: 'absence',
    employeeId: 'emp3',
    employeeName: 'Mike Johnson',
    department: 'Sales',
    message: 'Mike Johnson has been automatically marked absent (no check-in by 12:00 PM)',
    timestamp: '1 hour ago',
    read: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'check_in',
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    department: 'Marketing',
    message: 'Jane Smith checked in at 9:00 AM',
    timestamp: '2 hours ago',
    read: true,
    priority: 'low'
  }
];

const AdminAttendanceManagement: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats>(mockAdminStats);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAllAttendanceRecords);
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(mockAdminNotifications);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadAttendanceStats();
    loadAllAttendance();
    loadNotifications();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadAttendanceStats();
      loadNotifications();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAttendanceStats = async () => {
    try {
      const data = await attendanceApi.getAttendanceStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load attendance stats:', error);
    }
  };

  const loadAllAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceApi.getAllAttendanceToday();
      setAttendanceRecords(data);
    } catch (error) {
      message.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await attendanceApi.getAttendanceNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleRecordUpdate = async (updatedRecord: AttendanceRecord) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    message.success('Attendance record updated successfully');
    
    // Reload stats to reflect changes
    loadAttendanceStats();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await attendanceApi.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const promises = notifications.filter(n => !n.read).map(n => 
        attendanceApi.markNotificationAsRead(n.id)
      );
      await Promise.all(promises);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const handleExportReport = async () => {
    try {
      const blob = await attendanceApi.exportAttendanceReport({
        date: new Date().toISOString().split('T')[0],
        includeAll: true
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('Attendance report exported successfully');
    } catch (error) {
      message.error('Failed to export attendance report');
    }
  };

  const handleProcessAutoAbsence = async () => {
    try {
      await attendanceApi.processAutoAbsence();
      message.success('Auto-absence processing completed');
      loadAttendanceStats();
      loadAllAttendance();
    } catch (error) {
      message.error('Failed to process auto-absence');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Attendance Management System"
        subtitle="Monitor and manage employee attendance with real-time tracking"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Admin', href: '/admin' }
        ]}
        extraButtons={[
          <Button 
            icon={<Download size={16} />} 
            onClick={handleExportReport}
          >
            Export Report
          </Button>,
          <Button 
            icon={<Settings size={16} />} 
            onClick={handleProcessAutoAbsence}
          >
            Process Auto-Absence
          </Button>
        ]}
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
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

        <TabPane
          tab={
            <span>
              <Users size={16} style={{ marginRight: 8 }} />
              All Attendance
            </span>
          }
          key="attendance"
        >
          <AttendanceHistoryTable
            records={attendanceRecords}
            loading={loading}
            showEmployeeColumn={true}
            allowEdit={true}
            onRecordUpdate={handleRecordUpdate}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <Bell size={16} style={{ marginRight: 8 }} />
              Notifications
              {unreadNotifications > 0 && (
                <span style={{ 
                  marginLeft: 8, 
                  background: '#ff4d4f', 
                  color: 'white', 
                  borderRadius: '10px', 
                  padding: '2px 6px', 
                  fontSize: '12px' 
                }}>
                  {unreadNotifications}
                </span>
              )}
            </span>
          }
          key="notifications"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <AttendanceNotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                showEmployeeInfo={true}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default AdminAttendanceManagement;