import React from 'react';
import { List, Avatar } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { ChartContainer } from './styles';

interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: string;
  priority: string;
  created_at: string;
}

interface AnnouncementsSectionProps {
  announcements?: Announcement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements = [] }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const getTypeIcon = (type: string) => {
    return <SoundOutlined />;
  };

  return (
    <ChartContainer title="Recent Announcements">
      <List
        itemLayout="horizontal"
        dataSource={announcements.slice(0, 4)}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  style={{ backgroundColor: getPriorityColor(item.priority) }} 
                  icon={getTypeIcon(item.announcement_type)} 
                />
              }
              title={item.title}
              description={item.content.length > 60 ? `${item.content.substring(0, 60)}...` : item.content}
            />
          </List.Item>
        )}
      />
    </ChartContainer>
  );
};