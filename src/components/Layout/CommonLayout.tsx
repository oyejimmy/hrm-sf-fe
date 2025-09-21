import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tag, Avatar, theme, Dropdown, Button, Space, Badge, Drawer } from 'antd';
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
  MenuOutlined,
} from '@ant-design/icons';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { MenuProps } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsive } from '../../hooks';
import styled from 'styled-components';

const { Header: AntHeader, Content, Sider } = Layout;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(AntHeader)`
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'} !important;
  padding: 0 24px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'} !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px !important;
  line-height: 64px !important;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0 16px !important;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : '#001529'};
  font-weight: bold;
  font-size: 18px;
  height: 64px;
  
  .logo-icon {
    background: ${props => props.theme?.colors?.primary || '#2958C4'};
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    gap: 4px;
    
    .logo-icon {
      width: 24px;
      height: 24px;
      font-size: 10px;
    }
    
    span {
      font-size: 10px;
    }
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
  min-height: calc(100vh - 64px);
  overflow: auto;
  margin-top: 64px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
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
  height: calc(100vh - 64px);
  position: fixed !important;
  left: 0;
  top: 64px;
  bottom: 0;
  z-index: 9;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.textPrimary || '#262626'};
    background: transparent;
    border: none;
    padding: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .anticon {
      font-size: 16px;
    }
  }
`;

const ResponsiveLayout = styled(Layout)<{ $isMobile: boolean; $siderWidth: number; $collapsed: boolean }>`
  margin-left: ${props => 
    props.$isMobile ? '0' : 
    props.$collapsed ? '80px' : 
    `${props.$siderWidth}px`
  };
  transition: margin-left 0.2s;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

interface CommonLayoutProps {
  userRole: 'admin' | 'hr' | 'employee' | 'team_lead';
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();
  const { isMobile, isDesktop } = useResponsive();
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderWidth = userRole === 'employee' ? 300 : 250;

  useEffect(() => {
    if (isMobile) {
      setSiderCollapsed(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const toggleSider = () => {
    if (isMobile) {
      setMobileDrawerVisible(!mobileDrawerVisible);
    } else {
      setSiderCollapsed(!siderCollapsed);
    }
  };

  const closeMobileDrawer = () => {
    setMobileDrawerVisible(false);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
    if (isMobile) {
      closeMobileDrawer();
    }
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
            key: '/admin/notifications',
            icon: <BellOutlined />,
            label: 'Notification Management',
          },
        ];
      case 'team_lead':
        return [
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
            key: '/employee/complain',
            icon: <FileTextOutlined />,
            label: 'Complaints',
          },
          {
            key: '/employee/request',
            icon: <FileTextOutlined />,
            label: 'Requests',
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
      case 'team_lead':
        return 'HRM Team Lead';
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
      case 'team_lead':
        return 'Team Lead Panel';
      case 'employee':
        return 'Employee Portal';
      default:
        return 'Portal';
    }
  };



  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        let profilePath = '/employee/profile';
        if (userRole === 'admin' || userRole === 'hr') {
          profilePath = '/admin/profile';
        } else if (userRole === 'team_lead') {
          profilePath = '/team-lead/profile';
        }
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

  const renderSiderContent = () => (
    <>
      {siderCollapsed && !isMobile && (
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'}`,
          marginTop: '0'
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
          {!isMobile && (
            <CollapseButton
              onClick={toggleSider}
              type="text"
            >
              <PanelLeftClose size={16} />
            </CollapseButton>
          )}
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
    </>
  );

  return (
    <StyledLayout>
      <StyledHeader>
        <LogoContainer>
          <MobileMenuButton
            icon={<MenuOutlined />}
            onClick={toggleSider}
            type="text"
          />
          <div className="logo-icon">HR</div>
          <span>{getTitle()}</span>
        </LogoContainer>

        <Space size={isMobile ? "small" : "middle"}>
          <Tag
            icon={<UserOutlined />}
            color={isDarkMode ? currentTheme?.colors?.secondary : "blue"}
            style={{ fontSize: isMobile ? '10px' : '14px', padding: isMobile ? '0 4px' : '4px 8px' }}>
            {isMobile ? getHeaderTitle().split(' ')[0] : getHeaderTitle()}
          </Tag>

          <ThemeToggleButton
            icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            type="text"
            size={isMobile ? "small" : "middle"}
          />

          <NotificationButton
            icon={
              <Badge dot count={3} size="small">
                <BellOutlined style={{ fontSize: isMobile ? '14px' : '16px' }} />
              </Badge>
            }
            onClick={handleNotificationsClick}
            type="text"
            size={isMobile ? "small" : "middle"}
          />

          {!isMobile && <VerticalDivider />}

          {/* User dropdown */}
          <Dropdown
            overlay={userDropdownMenu}
            placement="bottomRight"
            trigger={['click']}
          >
            <UserDropdownButton type="text">
              <Avatar
                size={isMobile ? 24 : "small"}
                icon={<UserOutlined />}
                src={user?.profile_picture}
              />
              {!isMobile && (
                <span>
                  {user?.first_name} {user?.last_name}
                </span>
              )}
            </UserDropdownButton>
          </Dropdown>
        </Space>
      </StyledHeader>

      {/* Desktop Sidebar */}
      {isDesktop && (
        <StickySider
          width={siderWidth}
          theme={isDarkMode ? 'dark' : 'light'}
          collapsed={siderCollapsed}
          collapsible
          trigger={null}
        >
          {renderSiderContent()}
        </StickySider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title={getTitle()}
        placement="left"
        onClose={closeMobileDrawer}
        open={mobileDrawerVisible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ 
          background: isDarkMode ? '#001529' : '#ffffff',
          color: isDarkMode ? 'white' : '#001529'
        }}
        width={siderWidth}
      >
        <div style={{ background: isDarkMode ? '#001529' : '#ffffff', height: '100%' }}>
          {renderSiderContent()}
        </div>
      </Drawer>

      <ResponsiveLayout 
        $isMobile={isMobile} 
        $siderWidth={siderWidth} 
        $collapsed={siderCollapsed}
      >
        <StyledContent>
          <Outlet />
        </StyledContent>
      </ResponsiveLayout>
    </StyledLayout>
  );
};