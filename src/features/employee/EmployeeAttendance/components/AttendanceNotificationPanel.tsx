import React from 'react';
import { Badge, Button, Space, Typography, Tag, Empty, message } from 'antd';
import { Bell, Clock, Coffee, LogIn, LogOut, AlertTriangle, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../services/api/api';
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

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['attendance-notifications'],
    queryFn: () => api.get('/api/attendance/records?limit=10').then(res => {
      // Transform attendance records into notifications
      return res.data.map((record: any) => {
        const notifications = [];
        
        if (record.check_in) {
          notifications.push({
            id: `${record.id}-checkin`,
            type: 'check_in',
            message: `Checked in at ${record.check_in}`,
            timestamp: record.date,
            priority: 'low',
            read: true
          });
        }
        
        if (record.check_out) {
          notifications.push({
            id: `${record.id}-checkout`,
            type: 'check_out',
            message: `Checked out at ${record.check_out}`,
            timestamp: record.date,
            priority: 'low',
            read: true
          });
        }
        
        record.break_details?.forEach((breakRecord: any, index: number) => {
          if (breakRecord.start_time) {
            notifications.push({
              id: `${record.id}-break-start-${index}`,
              type: 'break_start',
              message: `Break started at ${breakRecord.start_time}`,
              timestamp: record.date,
              priority: 'low',
              read: true
            });
          }
          
          if (breakRecord.end_time) {
            notifications.push({
              id: `${record.id}-break-end-${index}`,
              type: 'break_end',
              message: `Break ended at ${breakRecord.end_time} (${breakRecord.duration_minutes} min)`,
              timestamp: record.date,
              priority: 'low',
              read: true
            });
          }
        });
        
        return notifications;
      }).flat().slice(0, 20);
    }),
    refetchInterval: 60000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => Promise.resolve(),
    onSuccess: () => {
      message.success('Notification marked as read');
      queryClient.invalidateQueries({ queryKey: ['attendance-notifications'] });
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const getIcon = (type: string) => {
    const iconMap = {
      check_in: <LogIn size={16} color="#52c41a" />,
      check_out: <LogOut size={16} color="#1890ff" />,
      break_start: <Coffee size={16} color="#faad14" />,
      break_end: <Coffee size={16} color="#52c41a" />,
      absence: <AlertTriangle size={16} color="#ff4d4f" />,
      late_arrival: <Clock size={16} color="#faad14" />
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
      late_arrival: 'Late Arrival'
    };
    return labelMap[type as keyof typeof labelMap] || 'Notification';
  };

  const handleMarkAllAsRead = () => {
    message.success('All notifications marked as read');
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
            {notifications.map((notification: any) => (
              <NotificationCard
                key={notification.id}
                $read={notification.read}
                $priority={notification.priority}
              >
                <NotificationHeader>
                  <Space>
                    {getIcon(notification.type)}
                    <Tag color="blue">
                      {getTypeLabel(notification.type)}
                    </Tag>
                  </Space>
                  <TimeStamp>{notification.timestamp}</TimeStamp>
                </NotificationHeader>
                
                <NotificationContent>
                  <Text style={{ fontSize: '13px' }}>
                    {notification.message}
                  </Text>
                </NotificationContent>
              </NotificationCard>
            ))}
          </NotificationScrollContainer>
        )}
      </NotificationPanelCard>
    </EqualHeightContainer>
  );
};

export default AttendanceNotificationPanel;