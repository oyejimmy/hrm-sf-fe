import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TrophyOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider, Content } = Layout;

export const TeamLeadLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const menuItems = [
    {
      key: '/team-lead/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/team-lead/attendance',
      icon: <CalendarOutlined />,
      label: 'Team Attendance',
    },
    {
      key: '/team-lead/leave-requests',
      icon: <FileTextOutlined />,
      label: 'Leave Requests',
    },
    {
      key: '/team-lead/performance',
      icon: <TrophyOutlined />,
      label: 'Performance',
    },
    {
      key: '/team-lead/training',
      icon: <BookOutlined />,
      label: 'Training',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme={isDarkMode ? 'dark' : 'light'} width={250}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isDarkMode ? 'white' : '#1890ff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`
        }}>
          HRM Team Lead
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header title="Team Lead Panel" />
        <Content style={{ 
          margin: '24px', 
          background: isDarkMode ? '#141414' : '#fff', 
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};