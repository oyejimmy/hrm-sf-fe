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

const StyledSider = styled(Sider) <{ $isDarkMode: boolean }>`
  position: sticky;
  top: 0;
  box-shadow: ${props => props.$isDarkMode
    ? '2px 0 8px rgba(0, 0, 0, 0.15)'
    : '2px 0 8px rgba(0, 0, 0, 0.1)'};
  z-index: 999;
  background: ${props => props.$isDarkMode ? '#141414' : 'white'};
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
`;

const StyledContent = styled(Content) <{ $isDarkMode: boolean }>`
  margin: 24px;
  background: ${props => props.$isDarkMode ? '#141414' : '#fff'};
  padding: 24px;
  border-radius: 8px;
  min-height: calc(100vh - 112px);
`;

const LogoContainer = styled.div<{ $isDarkMode: boolean }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDarkMode ? 'white' : '#1890ff'};
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#303030' : '#f0f0f0'};
  flex-shrink: 0;
`;

const UserProfile = styled.div<{ $isDarkMode: boolean }>`
  padding: 24px 16px;
  text-align: center;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#303030' : '#f0f0f0'};
  background: ${props => props.$isDarkMode ? '#141414' : 'white'};
  flex-shrink: 0;
`;

const UserAvatar = styled.div<{ $isDarkMode: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #52c41a 100%);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
`;

const UserName = styled.h2<{ $isDarkMode: boolean }>`
  margin: 0 0 8px;
  color: ${props => props.$isDarkMode ? 'white' : '#262626'};
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
    <StyledLayout>
      <StyledSider
        theme={isDarkMode ? 'dark' : 'light'}
        width={300}
        $isDarkMode={isDarkMode}
      >
        <LogoContainer $isDarkMode={isDarkMode}>
          HRM Employee
        </LogoContainer>

        <UserProfile $isDarkMode={isDarkMode}>
          <UserAvatar $isDarkMode={isDarkMode}>
            <UserOutlined style={{ fontSize: '36px' }} />
          </UserAvatar>
          <UserName $isDarkMode={isDarkMode}>Jamil</UserName>
          <Tag color={isDarkMode ? "gold" : "purple"}>Welcome Back</Tag>
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
        <StyledContent $isDarkMode={isDarkMode}>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};