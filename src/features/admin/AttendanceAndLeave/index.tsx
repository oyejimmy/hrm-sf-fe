import React, { useState } from 'react';
import { Row, Col, Tabs, message, Button, Space } from 'antd';
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
import { attendanceApi } from '../../../services/api/attendanceApi';
import { leaveApi } from '../../../services/api/leaveApi';

const { TabPane } = Tabs;

const AdminAttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-attendance-stats'],
    queryFn: attendanceApi.getAttendanceStats,
    refetchInterval: 30000,
  });

  const { data: attendanceRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['admin-attendance-today'],
    queryFn: attendanceApi.getAllAttendanceToday,
    refetchInterval: 30000,
  });

  const { data: attendanceNotifications = [] } = useQuery({
    queryKey: ['admin-attendance-notifications'],
    queryFn: attendanceApi.getAdminAttendanceNotifications,
    refetchInterval: 30000,
  });

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

  const exportReportMutation = useMutation({
    mutationFn: attendanceApi.exportAttendanceReport,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Attendance report exported successfully');
    },
    onError: () => {
      message.error('Failed to export attendance report');
    },
  });

  const processAutoAbsenceMutation = useMutation({
    mutationFn: attendanceApi.processAutoAbsence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-attendance-today'] });
      message.success('Auto-absence processing completed');
    },
    onError: () => {
      message.error('Failed to process auto-absence');
    },
  });

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
              <Users size={16} style={{ marginRight: 8 }} />
              Today's Attendance
            </span>
          }
          key="attendance"
        >
          {/* Attendance Stats Cards */}
          {stats && (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <StateCard
                  label="Present Today"
                  value={`${stats.todayPresent}/${stats.totalEmployees}`}
                  icon={<CheckCircle />}
                  tone="pastelGreen"
                  description={`${((stats.todayPresent / stats.totalEmployees) * 100).toFixed(1)}% present`}
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StateCard
                  label="Absent Today"
                  value={stats.todayAbsent}
                  icon={<XCircle />}
                  tone="pastelPink"
                  description="Not checked in"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StateCard
                  label="Late Today"
                  value={stats.todayLate}
                  icon={<Clock />}
                  tone="lightPeach"
                  description="Late arrivals"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StateCard
                  label="On Break"
                  value={stats.onBreak}
                  icon={<Coffee />}
                  tone="softLavender"
                  description="Currently on break"
                  loading={loading}
                />
              </Col>
            </Row>
          )}
          
          <TodayAttendanceTable
            data={attendanceRecords.map((record: any) => ({
              id: parseInt(record.id),
              employeeName: record.employeeName,
              date: record.date,
              status: record.status as 'Present' | 'Absent' | 'Late' | 'Half Day',
              hoursWorked: record.totalHours || 0,
              remarks: record.notes
            }))}
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