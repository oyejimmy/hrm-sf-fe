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
    <StyledLayout>
      <StyledSider theme={isDarkMode ? 'dark' : 'light'} width={250}>
        <LogoContainer>
          HRM Team Lead
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
        <Header title="Team Lead Panel" />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};