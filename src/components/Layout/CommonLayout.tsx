import React, { useState } from 'react';
import { Layout, Menu, Tag, Avatar, theme, Dropdown, Button, Space, Badge } from 'antd';
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
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import styled from 'styled-components';

const { Header: AntHeader, Content, Sider } = Layout;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(AntHeader)`
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'} !important;
  padding: 0 ${props => props.theme?.spacing?.lg || '24px'} !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : (props.theme?.colors?.borderLight || '#f0f0f0')} !important;
  box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'} !important;
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  height: 64px;
  z-index: 10; /* Lower z-index to prevent overlapping modals */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : '#001529'};
  font-weight: bold;
  font-size: 18px;
  
  .logo-icon {
    background: ${props => props.theme?.colors?.primary || '#2958C4'};
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SiderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 63px;
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'};
`;

const SiderTitle = styled.div`
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : '#001529'};
  font-weight: bold;
  font-size: 16px;
`;

const CollapseButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const UserProfile = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'};
  position: relative;
`;

const UserAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #2958C4 0%, #C49629 100%);
  margin-bottom: 8px;
`;

const UserName = styled.div`
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : 'black'};
  font-weight: 500;
  margin-bottom: 8px;
`;

const MenuContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 180px);
`;

const StyledContent = styled(Content)`
  margin: 0;
  min-height: 280px;
  background: ${props => props.theme?.colors?.background || '#f5f5f5'};
  overflow: auto;
`;

const ThemeToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.colors?.secondary || '#C49629'};
  background: none;
  border: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.theme?.colors?.primary || '#2958C4'};
  }
`;

const NotificationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.colors?.textSecondary || '#8c8c8c'};
  background: none;
  border: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.theme?.colors?.primary || '#2958C4'};
  }
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
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.theme?.colors?.textPrimary || '#262626'};
  }
`;

const VerticalDivider = styled.div`
  height: 24px;
  width: 1px;
  margin: 0 ${props => props.theme?.spacing?.md || '16px'};
  background-color: ${props => props.theme?.colors?.border || '#d9d9d9'};
`;

const StickySider = styled(Sider)`
&&.ant-layout-sider .ant-layout-sider-children {
background: ${props => props.theme === 'dark' ? '#001529' : '#ffffff'};
color: ${props => props.theme === 'dark' ? '#001529' : '#ffffff'};
}
&.ant-layout-sider-dark {
    background: #001529 !important;
    border-right: ${props => props.theme === 'dark' ? '1px solidrgb(5, 46, 84)' : '1px solid #d9d9d9'};
  }
  height: 100vh;
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
  // Adjust content margin when sider is collapsed
  & ~ .ant-layout {
    margin-left: ${props => props.collapsed ? 80 : (props.width || 200)}px !important;
    transition: margin-left 0.2s;
  }
`;

interface CommonLayoutProps {
  userRole: 'admin' | 'hr' | 'employee';
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const toggleSider = () => {
    setSiderCollapsed(!siderCollapsed);
  };

  const getMenuItems = (): MenuProps['items'] => {
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
          {
            key: '/admin/profile',
            icon: <UserOutlined />,
            label: 'Profile',
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
          {
            key: '/employee/profile',
            icon: <UserOutlined />,
            label: 'Profile',
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

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        const profilePath = userRole === 'admin' || userRole === 'hr' ? '/admin/profile' : '/employee/profile';
        navigate(profilePath);
      },
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

  // User dropdown menu
  const userDropdownMenu = (
    <Menu items={userMenuItems} />
  );

  return (
    <StyledLayout>
      <StyledHeader>
        {/* Logo on the left */}
        <LogoContainer>
          <div className="logo-icon">HR</div>
          <span>{getTitle()}</span>
        </LogoContainer>

        <Space size="middle">
          <Tag
            icon={<UserOutlined />}
            color={isDarkMode ? currentTheme?.colors?.secondary : "blue"}>
            {getHeaderTitle()}
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

          <VerticalDivider />

          {/* User dropdown */}
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
        </Space>
      </StyledHeader>

      <Layout>
        <StickySider
          width={userRole === 'employee' ? 300 : 250}
          theme={isDarkMode ? 'dark' : 'light'}
          collapsed={siderCollapsed}
          collapsible
          trigger={null}
        >
          {/* Sider header with title */}
          {!siderCollapsed && (
            <SiderHeader>
              <SiderTitle>{getTitle()}</SiderTitle>
            </SiderHeader>
          )}

          {siderCollapsed && (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'}`,
              marginTop: '65px'
            }}>
              <CollapseButton
                onClick={toggleSider}
                type="text"
                style={{ position: 'static', margin: '0 auto', top: 'auto', right: 'auto' }}
              >
                <PanelLeftOpen size={16} />
              </CollapseButton>
            </div>
          )}

          {!siderCollapsed && (
            <UserProfile>
              <CollapseButton
                onClick={toggleSider}
                type="text"
              >
                {siderCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </CollapseButton>
              <UserAvatar size={64} icon={<UserOutlined />} src={user?.profile_picture} />
              <UserName>{user?.first_name || 'User'}</UserName>
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
        </StickySider>

        <Layout style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <StyledContent
            style={{
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </StyledContent>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};