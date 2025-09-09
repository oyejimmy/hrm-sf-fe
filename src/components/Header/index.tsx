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
const HeaderContainer = styled(AntHeader) <{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? '#001529' : '#fff'} !important;
  padding: 0 24px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#303030' : '#f0f0f0'} !important;
  box-shadow: ${props => props.$isDarkMode
    ? '0 2px 12px rgba(0, 0, 0, 0.25)'
    : '0 2px 12px rgba(0, 0, 0, 0.1)'} !important;
  transition: all 0.3s ease;
  z-index: 1000;
  position: sticky;
  top: 0;
  height: 64px;
`;

const ThemeToggleButton = styled(Button) <{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDarkMode ? '#ffd666' : '#faad14'};
  &:hover {
    color: ${props => props.$isDarkMode ? '#ffd666' : '#1890ff'};
  }
`;

const NotificationButton = styled(Button) <{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDarkMode ? '#fff' : '#595959'};
  &:hover {
    color: ${props => props.$isDarkMode ? '#ffd666' : '#1890ff'};
  }
`;

const UserButton = styled(Button) <{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$isDarkMode ? '#fff' : 'inherit'};
  background: transparent;
  border-radius: 20px;
  padding: 4px 12px 4px 4px;
  &:hover {
    color: ${props => props.$isDarkMode ? '#fff' : 'inherit'};
  }
`;

const UserAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #1890ff 0%, #52c41a 100%);
`;

const VerticalDivider = styled(Divider) <{ $isDarkMode: boolean }>`
  height: 24px;
  margin: 0 16px;
  border-color: ${props => props.$isDarkMode ? '#434343' : '#d9d9d9'};
`;

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();

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
    <HeaderContainer $isDarkMode={isDarkMode}>
      <div style={{ width: 40 }}>
        {/* Spacer for balance */}
      </div>

      <Space size="middle">
        <Tag
          icon={<UserOutlined />}
          color={isDarkMode ? "gold" : "blue"}>
          {title}
        </Tag>

        <ThemeToggleButton
          $isDarkMode={isDarkMode}
          icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          type="text"
        />


        <NotificationButton
          $isDarkMode={isDarkMode}
          icon={
            <Badge dot count={3} size="small">
              <BellOutlined />
            </Badge>
          }
          onClick={handleNotificationsClick}
          type="text"
        />

        <VerticalDivider type="vertical" $isDarkMode={isDarkMode} />

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <UserButton $isDarkMode={isDarkMode} type="text">
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