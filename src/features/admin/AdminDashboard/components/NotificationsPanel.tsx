import React from 'react';
import { List, Avatar } from 'antd';
import { TeamOutlined, CalendarOutlined, BarChartOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ChartContainer } from './styles';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsPanelProps {
  notifications?: Notification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications = [] }) => {
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

  return (
    <ChartContainer title="Recent Notifications">
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: getColor(item.priority) }} icon={getIcon(item.type)} />}
              title={item.title}
              description={item.message}
            />
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{getTimeAgo(item.created_at)}</div>
          </List.Item>
        )}
      />
    </ChartContainer>
  );
};