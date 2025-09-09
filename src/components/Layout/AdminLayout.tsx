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
import styled from 'styled-components';

const { Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
`;

const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.colors?.primary || '#2958C4'};
  font-size: ${props => props.theme?.typography?.fontSize?.lg || '18px'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.bold || 700};
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'};
`;

const StyledContent = styled(Content)`
  margin: ${props => props.theme?.spacing?.lg || '24px'};
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  border-radius: ${props => props.theme?.borderRadius?.lg || '8px'};
`;

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
    <StyledLayout>
      <StyledSider theme={isDarkMode ? 'dark' : 'light'} width={250}>
        <LogoContainer>
          HRM Admin
        </LogoContainer>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>
      <Layout>
        <Header title="Admin Panel" />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};