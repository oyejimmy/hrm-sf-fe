import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  BookOutlined,
  DollarOutlined,
  ToolOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ThemeToggle } from '../common/ThemeToggle';
import { UserRoleTag } from '../common/UserRoleTag';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const StyledSider = styled(Sider)`
  background: #001529;
  
  .ant-layout-sider-trigger {
    background: #002140;
  }
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 48px);
`;

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  background: ${({ theme }) => theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  margin-bottom: 1px;
  transition: all 0.3s;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuButton = styled(Button)`
  border: none;
  box-shadow: none;
`;

export const EmployeeLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      key: '/employee/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/employee/attendance',
      icon: <ClockCircleOutlined />,
      label: 'Attendance',
    },
    {
      key: '/employee/leave',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
    },
    {
      key: '/employee/training',
      icon: <BookOutlined />,
      label: 'Training & Development',
    },
    {
      key: '/employee/payslip',
      icon: <DollarOutlined />,
      label: 'Payslip',
    },
    {
      key: '/employee/assets',
      icon: <ToolOutlined />,
      label: 'Assets',
    },
    {
      key: '/employee/documents',
      icon: <FileTextOutlined />,
      label: 'Documents',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation to login even if there's an error
      navigate('/login');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <Logo>
          {collapsed ? 'HRM' : 'HRM System'}
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>
      
      <Layout>
        <StyledHeader>
          <MenuButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <UserInfo>
            <Space>
              {user?.role && <UserRoleTag role={user.role} />}
              <Text strong>{user?.first_name} {user?.last_name}</Text>
              <ThemeToggle />
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer' }}
                />
              </Dropdown>
            </Space>
          </UserInfo>
        </StyledHeader>
        
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};
