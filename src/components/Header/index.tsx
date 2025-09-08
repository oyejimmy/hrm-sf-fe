import React from 'react';
import { Layout, Button, Dropdown, Avatar, Switch, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
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
    <AntHeader
      style={{
        background: isDarkMode ? '#001529' : '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
      }}
    >
      <Text
        strong
        style={{
          fontSize: '18px',
          color: isDarkMode ? '#fff' : '#1890ff',
          margin: 0,
        }}
      >
        {title}
      </Text>

      <Space size="middle">
        <Space align="center">
          {isDarkMode ? <BulbFilled /> : <BulbOutlined />}
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            size="small"
          />
        </Space>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isDarkMode ? '#fff' : 'inherit',
            }}
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              src={user?.profile_picture}
            />
            <span>
              {user?.first_name} {user?.last_name}
            </span>
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;