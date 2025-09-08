import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BookOutlined,
  DollarOutlined,
  LaptopOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider, Content } = Layout;

export const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const menuItems = [
    {
      key: '/employee/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/employee/attendance',
      icon: <CalendarOutlined />,
      label: 'Attendance',
    },
    {
      key: '/employee/leave',
      icon: <FileTextOutlined />,
      label: 'Leave Management',
    },
    {
      key: '/employee/training',
      icon: <BookOutlined />,
      label: 'Training',
    },
    {
      key: '/employee/payslip',
      icon: <DollarOutlined />,
      label: 'Payslip',
    },
    {
      key: '/employee/assets',
      icon: <LaptopOutlined />,
      label: 'Assets',
    },
    {
      key: '/employee/documents',
      icon: <FileOutlined />,
      label: 'Documents',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    console.log(key);
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
          HRM Employee
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
        <Header title="Employee Portal" />
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