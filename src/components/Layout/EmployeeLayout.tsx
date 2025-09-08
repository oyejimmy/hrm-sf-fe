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

const { Header, Sider, Content } = Layout;

export const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={250}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          HRM Employee
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>Employee Portal</h2>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};