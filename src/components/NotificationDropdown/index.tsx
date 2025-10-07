import React, { useState } from 'react';
import { Dropdown, List, Avatar, Button, Badge, Typography, Empty, Spin } from 'antd';
import { BellOutlined, TeamOutlined, CalendarOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../services/api/notificationApi';
import styled from 'styled-components';

const { Text } = Typography;

const NotificationContainer = styled.div`
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const NotificationItem = styled(List.Item)<{ $isRead: boolean }>`
  padding: 12px 16px !important;
  cursor: pointer;
  background: ${props => props.$isRead ? 'transparent' : '#f6f8ff'};
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background: #f5f5f5;
  }
  
  .ant-list-item-meta-title {
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .ant-list-item-meta-description {
    font-size: 12px;
    color: #666;
  }
`;

const TimeText = styled(Text)`
  font-size: 11px;
  color: #999;
`;

const ViewAllButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        return await notificationApi.getNotifications();
      } catch (error) {
        // Fallback mock data when API is not available
        return [
          {
            id: 1,
            title: 'Leave Request Approved',
            message: 'Your leave request for Dec 25-26 has been approved',
            type: 'leave',
            priority: 'medium',
            is_read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            title: 'New Announcement',
            message: 'Company holiday schedule updated',
            type: 'announcement',
            priority: 'high',
            is_read: false,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: 'Attendance Reminder',
            message: 'Please check in for today',
            type: 'attendance',
            priority: 'low',
            is_read: true,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
    },
    enabled: open,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave': return <CalendarOutlined />;
      case 'attendance': return <TeamOutlined />;
      case 'performance': return <BarChartOutlined />;
      case 'announcement': return <BellOutlined />;
      default: return <ExclamationCircleOutlined />;
    }
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId.toString());
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;

  const dropdownContent = (
    <NotificationContainer>
      <NotificationHeader>
        <span>Notifications</span>
        <Badge count={unreadCount} size="small" />
      </NotificationHeader>
      
      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: '20px' }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
          />
        </div>
      ) : (
        <>
          <List
            dataSource={notifications.slice(0, 5)}
            renderItem={(item: Notification) => (
              <NotificationItem 
                $isRead={item.is_read}
                onClick={() => handleMarkAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      style={{ backgroundColor: getColor(item.priority) }} 
                      icon={getIcon(item.type)} 
                      size="small"
                    />
                  }
                  title={item.title}
                  description={item.message}
                />
                <TimeText>{getTimeAgo(item.created_at)}</TimeText>
              </NotificationItem>
            )}
          />
          {notifications.length > 5 && (
            <div style={{ padding: '12px 16px' }}>
              <ViewAllButton type="link" size="small">
                View all notifications
              </ViewAllButton>
            </div>
          )}
        </>
      )}
    </NotificationContainer>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Badge count={unreadCount} size="small">
        {children}
      </Badge>
    </Dropdown>
  );
};