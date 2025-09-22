import React from 'react';
import { FileTextOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  isDarkMode: boolean;
}

const tabs = [
  { key: '1', icon: <FileTextOutlined />, label: 'My Requests' },
  { key: '2', icon: <FileSearchOutlined />, label: 'HR Documents' },
  { key: '3', icon: <BarChartOutlined />, label: 'Activity Logs' }
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, isDarkMode }) => {
  return (
    <div style={{
      borderBottom: `1px solid ${isDarkMode ? '#333' : '#e8e8e8'}`,
      padding: '0'
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              background: activeTab === tab.key 
                ? (isDarkMode ? '#2d2d2d' : '#f8f9fa')
                : 'transparent',
              border: 'none',
              padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: activeTab === tab.key 
                ? (isDarkMode ? '#1890ff' : '#1890ff')
                : (isDarkMode ? '#a0a0a0' : '#666'),
              fontWeight: activeTab === tab.key ? '600' : '400',
              fontSize: '14px',
              borderBottom: activeTab === tab.key 
                ? '2px solid #1890ff' 
                : '2px solid transparent',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon}
            <span className="tab-text">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};