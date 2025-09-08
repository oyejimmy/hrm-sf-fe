import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  FileOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/employees',
      icon: <UserOutlined />,
      label: 'Employees',
    },
    {
      key: '/admin/attendance-leave',
      icon: <CalendarOutlined />,
      label: 'Attendance & Leave',
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/admin/recruitment',
      icon: <TeamOutlined />,
      label: 'Recruitment',
    },
    {
      key: '/admin/performance',
      icon: <TrophyOutlined />,
      label: 'Performance',
    },
    {
      key: '/admin/training',
      icon: <BookOutlined />,
      label: 'Training',
    },
    {
      key: '/admin/documents',
      icon: <FileOutlined />,
      label: 'Documents',
    },
    {
      key: '/admin/communication',
      icon: <BellOutlined />,
      label: 'Communication',
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
          HRM Admin
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
        <Header title="Admin Panel" />
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