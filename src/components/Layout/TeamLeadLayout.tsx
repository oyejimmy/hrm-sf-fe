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

const { Header, Sider, Content } = Layout;

export const TeamLeadLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          HRM Team Lead
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
          <h2 style={{ margin: 0, color: '#1890ff' }}>Team Lead Panel</h2>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};