import React from 'react';
import { Layout, Menu, Tag } from 'antd';
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
  FileTextOutlined,
  DollarOutlined,
  LaptopOutlined,
} from '@ant-design/icons';
import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';
import { LogoContainer, MenuContainer, StyledContent, StyledLayout, StyledSider, UserAvatar, UserName, UserProfile } from './styles';

interface CommonLayoutProps {
  userRole: 'admin' | 'hr' | 'employee';
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
      case 'hr':
        return [
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
      case 'employee':
        return [
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
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'HRM Admin';
      case 'hr':
        return 'HRM HR';
      case 'employee':
        return 'HRM Employee';
      default:
        return 'HRM System';
    }
  };

  const getHeaderTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Panel';
      case 'hr':
        return 'HR Panel';
      case 'employee':
        return 'Employee Portal';
      default:
        return 'Portal';
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <StyledLayout>
      <StyledSider
        theme={isDarkMode ? 'dark' : 'light'}
        width={userRole === 'employee' ? 300 : 250}
      >
        <LogoContainer>
          {getTitle()}
        </LogoContainer>

        {userRole === 'employee' && (
          <UserProfile>
            <UserAvatar>
              <UserOutlined style={{ fontSize: '36px' }} />
            </UserAvatar>
            <UserName>Jamil</UserName>
            <Tag color={isDarkMode ? currentTheme?.colors?.secondary : "purple"}>Welcome Back</Tag>
          </UserProfile>
        )}

        <MenuContainer>
          <Menu
            theme={isDarkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            onClick={handleMenuClick}
          />
        </MenuContainer>
      </StyledSider>

      <Layout>
        <Header title={getHeaderTitle()} />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout >
  );
};