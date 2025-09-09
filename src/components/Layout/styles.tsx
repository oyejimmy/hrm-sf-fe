
import { Layout } from 'antd';
import styled from 'styled-components';

const { Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  position: sticky;
  top: 0;
  height: 100vh;
  box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  z-index: ${props => props.theme?.zIndex?.sticky || 1020};
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'} !important;
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
`;

const StyledContent = styled(Content)`
  min-height: calc(100vh - 112px);
`;

const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : (props.theme?.colors?.primary || '#2958C4')};
  font-size: ${props => props.theme?.typography?.fontSize?.lg || '18px'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.bold || 700};
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : (props.theme?.colors?.borderLight || '#f0f0f0')};
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'};
  flex-shrink: 0;
`;

const UserProfile = styled.div`
  padding: ${props => props.theme?.spacing?.lg || '24px'} ${props => props.theme?.spacing?.md || '16px'};
  text-align: center;
  border-bottom: 1px solid ${props => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : (props.theme?.colors?.borderLight || '#f0f0f0')};
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'};
  flex-shrink: 0;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme?.colors?.primary || '#2958C4'} 0%, ${props => props.theme?.colors?.secondary || '#C49629'} 100%);
  margin: 0 auto ${props => props.theme?.spacing?.md || '16px'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
`;

const UserName = styled.h2`
  margin: 0 0 ${props => props.theme?.spacing?.sm || '8px'};
  color: ${props => props.theme?.themeMode === 'dark' ? 'white' : (props.theme?.colors?.textPrimary || '#2D2F33')};
`;

const MenuContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'};
  
  .ant-menu {
    border-right: none;
    background: ${props => props.theme?.themeMode === 'dark' ? '#001529' : '#ffffff'} !important;
  }
`;

export {
    StyledLayout,
    StyledSider,
    StyledContent,
    LogoContainer,
    UserProfile,
    UserAvatar,
    UserName,
    MenuContainer,
};