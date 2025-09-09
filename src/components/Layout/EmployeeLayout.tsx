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
import { LogoContainer, MenuContainer, StyledContent, StyledLayout, StyledSider, UserAvatar, UserName, UserProfile } from './styles';

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