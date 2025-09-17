import React, { useState } from 'react';
import {
  Card,
  List,
  Badge,
  Avatar,
  Button,
  Space,
  Typography,
  Tag,
  Divider,
  Empty,
  Tooltip
} from 'antd';
import {
  Bell,
  Check,
  Clock,
  X,
  AlertCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import styled from 'styled-components';
import { LeaveNotification } from '../types';

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
  justify-content: between;
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

interface LeaveNotificationPanelProps {
  notifications: LeaveNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: LeaveNotification) => void;
}

const LeaveNotificationPanel: React.FC<LeaveNotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave_request':
        return <Calendar size={16} color="#1890ff" />;
      case 'leave_approved':
        return <Check size={16} color="#52c41a" />;
      case 'leave_rejected':
        return <X size={16} color="#ff4d4f" />;
      case 'leave_on_hold':
        return <Clock size={16} color="#faad14" />;
      case 'details_requested':
        return <MessageSquare size={16} color="#722ed1" />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'leave_request':
        return 'New Request';
      case 'leave_approved':
        return 'Approved';
      case 'leave_rejected':
        return 'Rejected';
      case 'leave_on_hold':
        return 'On Hold';
      case 'details_requested':
        return 'Details Needed';
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

  return (
    <Card
      title={
        <Space>
          <Bell size={18} />
          Leave Notifications
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
      {notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications"
        />
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.map(notification => (
            <NotificationCard
              key={notification.id}
              $read={notification.read}
              $priority={notification.priority}
              onClick={() => onNotificationClick(notification)}
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
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    From: {notification.fromEmployee}
                  </Text>
                </div>
              </NotificationContent>

              {!notification.read && (
                <div style={{ marginTop: 8, textAlign: 'right' }}>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
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

export default LeaveNotificationPanel;