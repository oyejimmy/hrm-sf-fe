import React, { useState } from 'react';
import { Row, Col, Tabs, message, Button, Space, Spin, Alert } from 'antd';
import { Users, BarChart3, Bell, Download, Settings, CheckCircle, XCircle, Clock, Coffee } from 'lucide-react';
import { StateCard } from '../../../components/StateCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import AttendanceStatsPanel from '../../employee/EmployeeAttendance/components/AttendanceStatsPanel';
import AttendanceNotificationPanel from '../../employee/EmployeeAttendance/components/AttendanceNotificationPanel';
import TodayAttendanceTable from './components/TodayAttendance/TodayAttendanceTable';
import TodayAttendanceModal from './components/TodayAttendance/TodayAttendanceModal';
import LeaveManagementPanel from './components/LeaveManagementPanel';
import { 
  AttendanceRecord, 
  AttendanceNotification, 
  AttendanceStats 
} from '../../employee/EmployeeAttendance/types';
import { Attendance } from './types';
import { 
  useAllAttendanceToday, 
  useAttendanceStats, 
  useAdminAttendanceNotifications,
  useExportAttendanceReport,
  useProcessAutoAbsence
} from '../../../hooks/api/useAttendance';
import { leaveApi } from '../../../services/api/leaveApi';

const { TabPane } = Tabs;

const AdminAttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attendance');
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

  const { data: leaveNotifications = [] } = useQuery({
    queryKey: ['admin-leave-notifications'],
    queryFn: leaveApi.getAdminLeaveNotifications,
    refetchInterval: 30000,
  });

  const { data: pendingLeaves = [] } = useQuery({
    queryKey: ['admin-pending-leaves'],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const { data: allNotifications = [] } = useQuery({
    queryKey: ['user-notifications'],
    queryFn: () => leaveApi.getUserNotifications(false),
    refetchInterval: 30000,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-notification-count'],
    queryFn: leaveApi.getUnreadNotificationCount,
    refetchInterval: 30000,
  });



  // Mutations
  const markNotificationMutation = useMutation({
    mutationFn: leaveApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
      message.success('Notification marked as read');
    },
    onError: () => {
      message.error('Failed to mark notification as read');
    },
  });

  const markAllNotificationsMutation = useMutation({
    mutationFn: leaveApi.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
      message.success('All notifications marked as read');
    },
    onError: () => {
      message.error('Failed to mark all notifications as read');
    },
  });

  // Remove the old mutations since we're using the new hooks

  const approveLeaveRequestMutation = useMutation({
    mutationFn: ({ requestId }: { requestId: string }) => 
      leaveApi.approveLeaveRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-notifications'] });
      message.success('Leave request approved successfully');
    },
    onError: () => {
      message.error('Failed to approve leave request');
    },
  });

  const rejectLeaveRequestMutation = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) => 
      leaveApi.rejectLeaveRequest(requestId, { rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-notifications'] });
      message.success('Leave request rejected successfully');
    },
    onError: () => {
      message.error('Failed to reject leave request');
    },
  });

  // Event handlers
  const handleRecordUpdate = async (updatedRecord: AttendanceRecord) => {
    // Optimistically update the cache
    queryClient.setQueryData(['admin-attendance-today'], (old: AttendanceRecord[] = []) => 
      old.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    
    // Invalidate to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ['admin-attendance-stats'] });
    message.success('Attendance record updated successfully');
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsMutation.mutate();
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

  const handleApproveLeave = (requestId: string) => {
    approveLeaveRequestMutation.mutate({ requestId });
  };

  const handleRejectLeave = (requestId: string, reason: string) => {
    rejectLeaveRequestMutation.mutate({ requestId, reason });
  };

  // Attendance handlers
  const handleEditAttendance = (record?: Attendance) => {
    setSelectedAttendance(record || null);
    setAttendanceModalVisible(true);
  };

  const handleDeleteAttendance = (id: number) => {
    // Implementation for delete attendance
    message.success('Attendance record deleted');
  };

  const handleSaveAttendance = (data: Attendance) => {
    // Implementation for save attendance
    setAttendanceModalVisible(false);
    setSelectedAttendance(null);
    queryClient.invalidateQueries({ queryKey: ['admin-attendance-today'] });
    message.success('Attendance record saved');
  };



  // Combine all notifications
  const combinedNotifications = [...attendanceNotifications, ...leaveNotifications, ...allNotifications];
  const unreadNotifications = unreadCountData?.count || 0;
  const loading = statsLoading || recordsLoading;
  const hasError = statsError || recordsError;

  // Show error state if there's a critical error
  if (hasError) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <HeaderComponent
          isDarkMode={isDarkMode}
          title="Attendance Management System"
          subtitle="Monitor and manage employee attendance with real-time tracking"
          breadcrumbItems={[
            { title: 'Home', href: '/' },
            { title: 'Admin', href: '/admin' }
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
          { title: 'Admin', href: '/admin' }
        ]}
        extraButtons={[
          <Button 
            icon={<Download size={16} />} 
            onClick={handleExportReport}
            loading={exportReportMutation.isPending}
            disabled={loading}
          >
            Export Report
          </Button>,
          <Button 
            icon={<Settings size={16} />} 
            onClick={handleProcessAutoAbsence}
            loading={processAutoAbsenceMutation.isPending}
            disabled={loading}
          >
            Process Auto-Absence
          </Button>
        ]}
      />

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading attendance data...</div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
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
              <Users size={16} style={{ marginRight: 8 }} />
              Leave Management
              {pendingLeaves.length > 0 && (
                <span style={{ 
                  marginLeft: 8, 
                  background: '#1890ff', 
                  color: 'white', 
                  borderRadius: '10px', 
                  padding: '2px 6px', 
                  fontSize: '12px' 
                }}>
                  {pendingLeaves.length}
                </span>
              )}
            </span>
          }
          key="leaves"
        >
          <LeaveManagementPanel />
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
              <AttendanceNotificationPanel />
            </Col>
          </Row>
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
      )}

      {/* Modals */}
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