import React, { useState, useEffect } from 'react';
import {
  notification,
  Badge,
  Dropdown,
  Menu,
  Button,
  List,
  Avatar,
  Typography,
  Space,
  Divider,
  Empty
} from 'antd';
import {
  Bell,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import styled from 'styled-components';
import { useTheme } from '../../../../contexts/ThemeContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface NotificationItem {
  id: string;
  type: 'leave_approved' | 'leave_rejected' | 'leave_pending' | 'leave_reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface RealTimeNotificationsProps {
  userId?: string;
  onNotificationClick?: (notification: NotificationItem) => void;
}

const NotificationDropdown = styled.div<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#d9d9d9'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-height: 400px;
  overflow: hidden;
`;

const NotificationHeader = styled.div<{ $isDarkMode: boolean }>`
  padding: 16px;
  border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ $isDarkMode: boolean; $read: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  background: ${props => {
    if (!props.$read) {
      return props.$isDarkMode ? 'rgba(41, 88, 196, 0.1)' : 'rgba(41, 88, 196, 0.05)';
    }
    return 'transparent';
  }};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#f8f9fa'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$type) {
      case 'leave_approved': return '#f6ffed';
      case 'leave_rejected': return '#fff2f0';
      case 'leave_pending': return '#e6f7ff';
      case 'leave_reminder': return '#fffbe6';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'leave_approved': return '#52c41a';
      case 'leave_rejected': return '#ff4d4f';
      case 'leave_pending': return '#1890ff';
      case 'leave_reminder': return '#faad14';
      default: return '#666666';
    }
  }};
`;

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({
  userId,
  onNotificationClick
}) => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Mock notifications - in real app, this would come from WebSocket or polling
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'leave_approved',
        title: 'Leave Request Approved',
        message: 'Your annual leave request for Dec 25-30 has been approved by HR Manager.',
        timestamp: dayjs().subtract(1, 'hour').toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'leave_pending',
        title: 'Leave Request Submitted',
        message: 'Your sick leave request has been submitted and is pending approval.',
        timestamp: dayjs().subtract(2, 'hours').toISOString(),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'leave_reminder',
        title: 'Upcoming Leave',
        message: 'Reminder: Your approved leave starts tomorrow (Dec 25).',
        timestamp: dayjs().subtract(1, 'day').toISOString(),
        read: true,
        priority: 'medium'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification
      if (Math.random() > 0.95) { // 5% chance every interval
        const newNotification: NotificationItem = {
          id: Date.now().toString(),
          type: 'leave_approved',
          title: 'Leave Status Update',
          message: 'Your leave request status has been updated.',
          timestamp: dayjs().toISOString(),
          read: false,
          priority: 'medium'
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification
        notification.open({
          message: newNotification.title,
          description: newNotification.message,
          icon: <CheckCircle style={{ color: '#52c41a' }} />,
          placement: 'topRight'
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave_approved':
        return <CheckCircle size={16} />;
      case 'leave_rejected':
        return <XCircle size={16} />;
      case 'leave_pending':
        return <Clock size={16} />;
      case 'leave_reminder':
        return <AlertCircle size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
    );
    
    if (!notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (onNotificationClick) {
      onNotificationClick(notif);
    }

    setDropdownVisible(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setDropdownVisible(false);
  };

  const getTimeAgo = (timestamp: string) => {
    return (dayjs(timestamp) as any).fromNow();
  };

  const notificationMenu = (
    <NotificationDropdown $isDarkMode={isDarkMode}>
      <NotificationHeader $isDarkMode={isDarkMode}>
        <Space>
          <Bell size={16} />
          <Text strong>Notifications</Text>
          {unreadCount > 0 && (
            <Badge count={unreadCount} size="small" />
          )}
        </Space>
        <Space>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
          <Button 
            type="link" 
            size="small" 
            onClick={clearAllNotifications}
            danger
          >
            Clear all
          </Button>
        </Space>
      </NotificationHeader>
      
      <NotificationList>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
            />
          </div>
        ) : (
          notifications.map(notif => (
            <NotificationItem
              key={notif.id}
              $isDarkMode={isDarkMode}
              $read={notif.read}
              onClick={() => handleNotificationClick(notif)}
            >
              <Space align="start">
                <NotificationIcon $type={notif.type}>
                  {getNotificationIcon(notif.type)}
                </NotificationIcon>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: notif.read ? 'normal' : 'bold',
                    color: 'var(--text-primary)',
                    marginBottom: 4
                  }}>
                    {notif.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: 4,
                    lineHeight: 1.4
                  }}>
                    {notif.message}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: 'var(--text-secondary)'
                  }}>
                    {getTimeAgo(notif.timestamp)}
                  </div>
                </div>
              </Space>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </NotificationDropdown>
  );

  return (
    <Dropdown
      overlay={notificationMenu}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
    >
      <Button
        type="text"
        icon={
          <Badge count={unreadCount} size="small" offset={[2, -2]}>
            <Bell size={18} />
          </Badge>
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: '40px'
        }}
      />
    </Dropdown>
  );
};

export default RealTimeNotifications;