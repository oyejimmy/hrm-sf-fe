import React, { useState } from 'react';
import { Dropdown, List, Avatar, Button, Badge, Typography, Empty, Spin } from 'antd';
import { BellOutlined, TeamOutlined, CalendarOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../../services/api/notificationApi';
import { leaveApi } from '../../services/api/leaveApi';
import styled from 'styled-components';

const { Text } = Typography;

const NotificationContainer = styled.div`
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
`;



const TimeText = styled(Text)`
  font-size: 11px;
  color: #999;
`;

const ViewAllButton = styled(Button)`
  width: 100%;
  text-align: center;
  font-weight: 500;
`;

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  route?: string;
}

interface NotificationDropdownProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'hr' | 'employee' | 'team_lead';
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children, userRole = 'admin' }) => {
  const [open, setOpen] = useState(false);
  const [clickedNotifications, setClickedNotifications] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: leaveNotifications = [] } = useQuery({
    queryKey: ['admin-leave-notifications'],
    queryFn: async () => {
      try {
        return await leaveApi.getAdminLeaveNotifications();
      } catch (error) {
        console.error('Leave notifications API error:', error);
        return [];
      }
    },
    enabled: open && (userRole === 'admin' || userRole === 'hr'),
    refetchInterval: 30000,
  });

  const { data: generalNotifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        return await notificationApi.getNotifications();
      } catch (error) {
        return [];
      }
    },
    enabled: open,
  });

  const getNotificationRoute = (type: string, userRole: string = 'admin') => {
    if (userRole === 'employee') {
      switch (type) {
        case 'leave': return '/employee/leave';
        case 'attendance': return '/employee/attendance';
        case 'performance': return '/employee/dashboard';
        case 'announcement': return '/employee/dashboard';
        case 'training': return '/employee/training';
        case 'document': return '/employee/documents';
        default: return '/employee/dashboard';
      }
    }
    // Admin routes
    switch (type) {
      case 'leave': return '/admin/leave-management';
      case 'attendance': return '/admin/attendance-management';
      case 'performance': return '/admin/performance';
      case 'announcement': return '/admin/communication';
      case 'employee': return '/admin/employees';
      case 'recruitment': return '/admin/recruitment';
      case 'training': return '/admin/training';
      case 'document': return '/admin/documents';
      default: return '/admin/dashboard';
    }
  };

  // Combine leave notifications with general notifications
  const notifications = [
    ...(userRole === 'admin' || userRole === 'hr' ? leaveNotifications.map((notification: any) => {
      const mappedNotification = {
        id: notification.id,
        title: notification.title || 'New Leave Request',
        message: notification.message,
        type: 'leave',
        priority: 'medium',
        is_read: clickedNotifications.has(notification.id) || notification.is_read || false,
        created_at: notification.createdAt || notification.created_at || new Date().toISOString(),
        route: getNotificationRoute('leave', userRole)
      };
      console.log('Mapped leave notification:', mappedNotification);
      return mappedNotification;
    }) : []),
    ...generalNotifications.map((notification: any) => ({
      ...notification,
      route: notification.route || getNotificationRoute(notification.type, userRole)
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  console.log('All notifications:', notifications);

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

  const handleNotificationClick = async (notification: Notification) => {
    console.log('Notification clicked:', notification);
    try {
      if (notification.type === 'leave') {
        // Mark as read locally
        setClickedNotifications(prev => new Set(prev).add(notification.id));
      } else {
        try {
          await notificationApi.markAsRead(notification.id.toString());
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        } catch (error) {
          console.error('Failed to mark general notification as read:', error);
        }
      }
      
      if (notification.route) {
        console.log('Navigating to:', notification.route);
        navigate(notification.route);
      } else {
        console.log('No route defined for notification');
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to handle notification click:', error);
      // Still navigate even if marking as read fails
      if (notification.route) {
        navigate(notification.route);
      }
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter((n: Notification) => !n.is_read && !clickedNotifications.has(n.id)).length;

  const dropdownContent = (
    <NotificationContainer>
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
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: item.is_read || clickedNotifications.has(item.id) ? '#ffffff' : '#f6f8ff',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = item.is_read || clickedNotifications.has(item.id) ? '#ffffff' : '#f6f8ff'}
                onClick={() => handleNotificationClick(item)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      style={{ backgroundColor: getColor(item.priority) }} 
                      icon={getIcon(item.type)} 
                      size="small"
                    />
                  }
                  title={<span style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</span>}
                  description={<span style={{ fontSize: '12px', color: '#666' }}>{item.message}</span>}
                />
                <TimeText>{getTimeAgo(item.created_at)}</TimeText>
              </List.Item>
            )}
          />
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
            <ViewAllButton 
              type="link" 
              size="small"
              onClick={() => {
                const notificationsRoute = userRole === 'employee' ? '/employee/dashboard' : '/admin/notifications';
                navigate(notificationsRoute);
                setOpen(false);
              }}
            >
              View All Notifications
            </ViewAllButton>
          </div>
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