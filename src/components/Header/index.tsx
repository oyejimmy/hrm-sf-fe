import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, Tag, Divider, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import styled from 'styled-components';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  title: string;
}

// Styled Components
const HeaderContainer = styled(AntHeader)`
  background: ${props => props.theme?.colors?.surface || '#ffffff'} !important;
  padding: 0 ${props => props.theme?.spacing?.lg || '24px'} !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'} !important;
  box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'} !important;
  transition: all 0.3s ease;
  z-index: ${props => props.theme?.zIndex?.sticky || 1020};
  position: sticky;
  top: 0;
  height: 64px;
`;

const ThemeToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.colors?.secondary || '#C49629'};
  &:hover {
    color: ${props => props.theme?.colors?.primary || '#2958C4'};
  }
`;

const NotificationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.colors?.textSecondary || '#8c8c8c'};
  &:hover {
    color: ${props => props.theme?.colors?.primary || '#2958C4'};
  }
`;

const UserButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme?.spacing?.sm || '8px'};
  color: ${props => props.theme?.colors?.textPrimary || '#262626'};
  background: transparent;
  border-radius: 20px;
  padding: 4px 12px 4px 4px;
  &:hover {
    color: ${props => props.theme?.colors?.textPrimary || '#262626'};
  }
`;

const UserAvatar = styled(Avatar)`
  background: linear-gradient(135deg, ${props => props.theme?.colors?.primary || '#2958C4'} 0%, ${props => props.theme?.colors?.secondary || '#C49629'} 100%);
`;

const VerticalDivider = styled(Divider)`
  height: 24px;
  margin: 0 ${props => props.theme?.spacing?.md || '16px'};
  border-color: ${props => props.theme?.colors?.border || '#d9d9d9'};
`;

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
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
    <HeaderContainer>
      <div style={{ width: 40 }}>
        {/* Spacer for balance */}
      </div>

      <Space size="middle">
        <Tag
          icon={<UserOutlined />}
          color={currentTheme.colors.primary}>
          {title}
        </Tag>

        <ThemeToggleButton
          icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          type="text"
        />

        <NotificationButton
          icon={
            <Badge dot count={3} size="small">
              <BellOutlined />
            </Badge>
          }
          onClick={handleNotificationsClick}
          type="text"
        />

        <VerticalDivider type="vertical" />

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <UserButton type="text">
            <UserAvatar
              size="small"
              icon={<UserOutlined />}
              src={user?.profile_picture}
            />
            <span>
              {user?.first_name} {user?.last_name}
            </span>
          </UserButton>
        </Dropdown>
      </Space>
    </HeaderContainer>
  );
};

export default Header;