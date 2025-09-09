import React from 'react';
import { Layout, Menu, Tag } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BookOutlined,
  DollarOutlined,
  LaptopOutlined,
  FileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';
import styled from 'styled-components';

const { Sider, Content } = Layout;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  position: sticky;
  top: 0;
  box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  z-index: ${props => props.theme?.zIndex?.sticky || 1020};
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
`;

const StyledContent = styled(Content)`
  margin: ${props => props.theme?.spacing?.lg || '24px'};
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  padding: ${props => props.theme?.spacing?.lg || '24px'};
  border-radius: ${props => props.theme?.borderRadius?.lg || '8px'};
  min-height: calc(100vh - 112px);
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
  flex-shrink: 0;
`;

const UserProfile = styled.div`
  padding: ${props => props.theme?.spacing?.lg || '24px'} ${props => props.theme?.spacing?.md || '16px'};
  text-align: center;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'};
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  flex-shrink: 0;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme?.colors?.primary || '#2958C4'} 0%, ${props => props.theme?.colors?.secondary || '#C49629'} 100%);
  margin: 0 auto ${props => props.theme?.spacing?.md || '16px'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
`;

const UserName = styled.h2`
  margin: 0 0 ${props => props.theme?.spacing?.sm || '8px'};
  color: ${props => props.theme?.colors?.textPrimary || '#2D2F33'};
`;

const MenuContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  .ant-menu {
    border-right: none;
  }
`;

export const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();

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
    <StyledLayout>
      <StyledSider
        theme={isDarkMode ? 'dark' : 'light'}
        width={300}
      >
        <LogoContainer>
          HRM Employee
        </LogoContainer>

        <UserProfile>
          <UserAvatar>
            <UserOutlined style={{ fontSize: '36px' }} />
          </UserAvatar>
          <UserName>Jamil</UserName>
          <Tag color={currentTheme.colors.secondary}>Welcome Back</Tag>
        </UserProfile>

        <MenuContainer>
          <Menu
            theme={isDarkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </MenuContainer>
      </StyledSider>

      <Layout>
        <Header title="Employee Portal" />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};