import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TrophyOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
// import { Header } from '../Header';
import { useTheme } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
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

const SiderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 65px;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'};
`;

const SiderTitle = styled.div`
  color: ${props => props.theme?.colors?.primary || '#2958C4'};
  font-weight: bold;
  font-size: 16px;
`;

const CollapseButton = styled(Button)`
  color: ${props => props.theme?.colors?.primary || '#2958C4'};
  border: none;
  background: transparent;
  
  &:hover {
    background: rgba(0, 0, 0, 0.06);
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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'};
`;

const UserDropdownButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme?.colors?.textPrimary || '#262626'};
  background: transparent;
  border: none;
  border-radius: 20px;
  padding: 4px 12px 4px 4px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: ${props => props.theme?.colors?.textPrimary || '#262626'};
  }
`;

export const TeamLeadLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems: any = [
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
    {
      key: '/team-lead/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const userMenuItems: any = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/team-lead/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const userDropdownMenu = (
    <Menu items={userMenuItems} />
  );

  return (
    <StyledLayout>
      <StyledSider
        theme={isDarkMode ? 'dark' : 'light'}
        width={250}
        collapsed={collapsed}
        collapsible
        trigger={null}
      >
        <SiderHeader>
          {!collapsed && <SiderTitle>HRM Team Lead</SiderTitle>}
          <CollapseButton
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            type="text"
          />
        </SiderHeader>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>
      <Layout>
        <HeaderContainer>
          <h2 style={{ margin: 0 }}>Team Lead Panel</h2>
          <Dropdown
            overlay={userDropdownMenu}
            placement="bottomRight"
            trigger={['click']}
          >
            <UserDropdownButton type="text">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.profile_picture}
              />
              <span>
                {user?.first_name} {user?.last_name}
              </span>
            </UserDropdownButton>
          </Dropdown>
        </HeaderContainer>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};