import React, { useState, useEffect } from 'react';
import { Card,  Badge, Button, Space, Typography, Tag, Empty } from 'antd';
import { Bell, Clock, Coffee, LogIn, LogOut, AlertTriangle, User } from 'lucide-react';
import { AttendanceNotification } from '../types';
// import { attendanceApi } from '../../../../services/api/attendanceApi';
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

const AttendanceNotificationPanel = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  showEmployeeInfo = false
}: any) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter((n: any) => !n.read).length;

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
      setLocalNotifications((prev: any) => 
        prev.map((n: any) => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onMarkAsRead(notificationId);
    setLocalNotifications((prev: any) => 
      prev.map((n: any) => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  return (
    <EqualHeightContainer>
      <NotificationPanelCard
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
          <NotificationScrollContainer>
          {localNotifications.map((notification: any) => (
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
          </NotificationScrollContainer>
        )}
      </NotificationPanelCard>
    </EqualHeightContainer>
  );
};

export default AttendanceNotificationPanel;