import React from 'react';
import {
  Card,
  Badge,
  Button,
  Space,
  Typography,
  Tag,
  Empty,
} from 'antd';
import {
  Bell,
  Check,
  Clock,
  X,
  Calendar,
  MessageSquare
} from 'lucide-react';
import {
  NotificationCard,
  NotificationHeader,
  NotificationContent,
  TimeStamp
} from './styles';
import { LeaveNotification } from '../types';

const { Text } = Typography;

// Define props interface for LeaveNotificationPanel
interface LeaveNotificationPanelProps {
  notifications: LeaveNotification[]; // Array of leave notifications
  onMarkAsRead: (notificationId: string) => void; // Callback to mark a notification as read
  onMarkAllAsRead: () => void; // Callback to mark all notifications as read
  onNotificationClick: (notification: LeaveNotification) => void; // Callback when a notification is clicked
}

// LeaveNotificationPanel functional component
const LeaveNotificationPanel: React.FC<LeaveNotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave_request': return <Calendar size={16} color="#1890ff" />; // Calendar icon for leave requests
      case 'leave_approved': return <Check size={16} color="#52c41a" />; // Check icon for approved leaves
      case 'leave_rejected': return <X size={16} color="#ff4d4f" />; // X icon for rejected leaves
      case 'leave_on_hold': return <Clock size={16} color="#faad14" />; // Clock icon for on-hold leaves
      case 'details_requested': return <MessageSquare size={16} color="#722ed1" />; // Message icon for details requested
      default: return <Bell size={16} />; // Default bell icon
    }
  };

  // Function to get label for notification type
  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'leave_request': return 'New Request'; // Label for leave requests
      case 'leave_approved': return 'Approved'; // Label for approved leaves
      case 'leave_rejected': return 'Rejected'; // Label for rejected leaves
      case 'leave_on_hold': return 'On Hold'; // Label for on-hold leaves
      case 'details_requested': return 'Details Needed'; // Label for details requested
      default: return 'Notification'; // Default label
    }
  };

  // Function to get color based on notification priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red'; // Red for high priority
      case 'medium': return 'orange'; // Orange for medium priority
      case 'low': return 'green'; // Green for low priority
      default: return 'blue'; // Default blue
    }
  };

  return (
    <Card
      style={{ marginTop: 16 }}
      title={
        <Space>
          <Bell size={18} />
          Notifications
          {unreadCount > 0 && <Badge count={unreadCount} />} {/* Show unread count badge */}
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