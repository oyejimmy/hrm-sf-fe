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

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          HRM Admin
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
          <h2 style={{ margin: 0, color: '#1890ff' }}>Admin Panel</h2>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};