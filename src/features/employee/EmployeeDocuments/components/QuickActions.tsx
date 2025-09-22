import React from 'react';
import { Button, Space } from 'antd';
import { Download, Share2, History } from 'lucide-react';
import { DocumentCard } from '../styles';
import { useTheme } from '../../../../contexts/ThemeContext';

export const QuickActions: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <DocumentCard title="Quick Actions" isDarkMode={isDarkMode} fixedHeight>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button icon={<Download size={16} />} block>Download All</Button>
        <Button icon={<Share2 size={16} />} block>Share Folder</Button>
        <Button icon={<History size={16} />} block>Recent Activity</Button>
      </Space>
    </DocumentCard>
  );
};