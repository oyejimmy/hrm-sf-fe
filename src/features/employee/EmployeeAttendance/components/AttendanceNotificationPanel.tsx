import React from 'react';
import { Badge, Button, Space, Typography, Tag, Empty, message } from 'antd';
import { Bell, Clock, Coffee, LogIn, LogOut, AlertTriangle, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '../../../../services/api/leaveApi';
import { attendanceApi } from '../../../../services/api/attendanceApi';
import {
  NotificationPanelCard,
  NotificationCard,
  NotificationHeader,
  NotificationContent,
  NotificationScrollContainer,
  TimeStamp,
  EqualHeightContainer
} from './styles';

const { Text } = Typography;

const AttendanceNotificationPanel: React.FC = () => {
  const queryClient = useQueryClient();

  // Get real notifications from API
  const { data: userNotifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['user-notifications'],
    queryFn: () => leaveApi.getUserNotifications(false),
    refetchInterval: 60000,
  });

  const { data: attendanceNotifications = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-notifications'],
    queryFn: attendanceApi.getAttendanceNotifications,
    refetchInterval: 60000,
  });

  // Combine all notifications
  const notifications = [...userNotifications, ...attendanceNotifications];
  const isLoading = notificationsLoading || attendanceLoading;

  const markAsReadMutation = useMutation({
    mutationFn: leaveApi.markNotificationAsRead,
    onSuccess: () => {
      message.success('Notification marked as read');
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
    onError: () => {
      message.error('Failed to mark notification as read');
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: leaveApi.markAllNotificationsAsRead,
    onSuccess: () => {
      message.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    },
    onError: () => {
      message.error('Failed to mark all notifications as read');
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read && !n.read).length;

  const getIcon = (type: string) => {
    const iconMap = {
      check_in: <LogIn size={16} color="#52c41a" />,
      check_out: <LogOut size={16} color="#1890ff" />,
      break_start: <Coffee size={16} color="#faad14" />,
      break_end: <Coffee size={16} color="#52c41a" />,
      absence: <AlertTriangle size={16} color="#ff4d4f" />,
      late_arrival: <Clock size={16} color="#faad14" />,
      leave_request: <User size={16} color="#1890ff" />,
      leave_approval: <User size={16} color="#52c41a" />,
      leave_rejection: <User size={16} color="#ff4d4f" />
    };
    return iconMap[type as keyof typeof iconMap] || <Bell size={16} />;
  };

  const getTypeLabel = (type: string) => {
    const labelMap = {
      check_in: 'Check In',
      check_out: 'Check Out', 
      break_start: 'Break Started',
      break_end: 'Break Ended',
      absence: 'Absence',
      late_arrival: 'Late Arrival',
      leave_request: 'Leave Request',
      leave_approval: 'Leave Approved',
      leave_rejection: 'Leave Rejected'
    };
    return labelMap[type as keyof typeof labelMap] || 'Notification';
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  return (
    <EqualHeightContainer>
      <NotificationPanelCard
        loading={isLoading}
        title={
          <Space>
            <Bell size={18} />
            Attendance Notifications
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </Space>
        }
        extra={
          unreadCount > 0 && (
            <Button size="small" type="link" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )
        }
      >
        {notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No attendance notifications"
          />
        ) : (
          <NotificationScrollContainer>
            {notifications.map((notification: any) => {
              const notificationType = notification.notification_type || notification.type || 'notification';
              const isRead = notification.is_read || notification.read || false;
              const timestamp = notification.created_at || notification.timestamp;
              
              return (
                <NotificationCard
                  key={notification.id}
                  $read={isRead}
                  $priority={notification.priority}
                  onClick={() => !isRead && handleMarkAsRead(notification.id)}
                  style={{ cursor: !isRead ? 'pointer' : 'default' }}
                >
                  <NotificationHeader>
                    <Space>
                      {getIcon(notificationType)}
                      <Tag color="blue">
                        {getTypeLabel(notificationType)}
                      </Tag>
                      {!isRead && <Tag color="red">New</Tag>}
                    </Space>
                    <TimeStamp>
                      {timestamp ? new Date(timestamp).toLocaleDateString() : 'Unknown'}
                    </TimeStamp>
                  </NotificationHeader>
                  
                  <NotificationContent>
                    <Text style={{ fontSize: '13px' }}>
                      {notification.message}
                    </Text>
                    {notification.title && notification.title !== notification.message && (
                      <Text strong style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        {notification.title}
                      </Text>
                    )}
                  </NotificationContent>
                </NotificationCard>
              );
            })}
          </NotificationScrollContainer>
        )}
      </NotificationPanelCard>
    </EqualHeightContainer>
  );
};

export default AttendanceNotificationPanel;