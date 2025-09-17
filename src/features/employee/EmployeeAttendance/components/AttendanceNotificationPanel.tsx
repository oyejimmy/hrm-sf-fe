import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Space, Typography, Tag, Empty, Tooltip } from 'antd';
import { Bell, Check, Clock, Coffee, LogIn, LogOut, AlertTriangle, User } from 'lucide-react';
import styled from 'styled-components';
import { AttendanceNotification } from '../types';
import { attendanceApi } from '../../../../services/api/attendanceApi';

const { Text } = Typography;

const NotificationCard = styled.div<{ $read: boolean; $priority: string }>`
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid ${props => 
    props.$priority === 'high' ? '#ff4d4f' :
    props.$priority === 'medium' ? '#faad14' : '#52c41a'
  };
  background: ${props => props.$read ? 'var(--surface)' : 'var(--surface-secondary)'};
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--surface-secondary);
    transform: translateY(-1px);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const NotificationContent = styled.div`
  margin-left: 32px;
`;

const TimeStamp = styled(Text)`
  font-size: 11px;
  color: var(--text-secondary);
`;

interface AttendanceNotificationPanelProps {
  notifications: AttendanceNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  showEmployeeInfo?: boolean;
}

const AttendanceNotificationPanel: React.FC<AttendanceNotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  showEmployeeInfo = false
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'check_in':
        return <LogIn size={16} color="#52c41a" />;
      case 'check_out':
        return <LogOut size={16} color="#1890ff" />;
      case 'break_start':
        return <Coffee size={16} color="#faad14" />;
      case 'break_end':
        return <Coffee size={16} color="#52c41a" />;
      case 'absence':
        return <AlertTriangle size={16} color="#ff4d4f" />;
      case 'late_arrival':
        return <Clock size={16} color="#faad14" />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'check_in':
        return 'Check In';
      case 'check_out':
        return 'Check Out';
      case 'break_start':
        return 'Break Started';
      case 'break_end':
        return 'Break Ended';
      case 'absence':
        return 'Absence';
      case 'late_arrival':
        return 'Late Arrival';
      default:
        return 'Notification';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const handleNotificationClick = (notification: AttendanceNotification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
      setLocalNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onMarkAsRead(notificationId);
    setLocalNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  return (
    <Card
      title={
        <Space>
          <Bell size={18} />
          Attendance Notifications
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </Space>
      }
      extra={
        unreadCount > 0 && (
          <Button size="small" type="link" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        )
      }
    >
      {localNotifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No attendance notifications"
        />
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {localNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              $read={notification.read}
              $priority={notification.priority}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationHeader>
                <Space>
                  {getNotificationIcon(notification.type)}
                  <Tag color={getPriorityColor(notification.priority)}>
                    {getNotificationTypeLabel(notification.type)}
                  </Tag>
                  {!notification.read && (
                    <Badge status="processing" />
                  )}
                </Space>
                <TimeStamp>{notification.timestamp}</TimeStamp>
              </NotificationHeader>
              
              <NotificationContent>
                <Text style={{ fontSize: '13px' }}>
                  {notification.message}
                </Text>
                
                {showEmployeeInfo && (
                  <div style={{ marginTop: 4 }}>
                    <Space size={4}>
                      <User size={12} />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {notification.employeeName} - {notification.department}
                      </Text>
                    </Space>
                  </div>
                )}
              </NotificationContent>

              {!notification.read && (
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                  >
                    Mark as read
                  </Button>
                </div>
              )}
            </NotificationCard>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AttendanceNotificationPanel;