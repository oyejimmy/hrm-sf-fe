import styled from 'styled-components';
import { Card, Tabs, Avatar, Flex, Typography, Form, Row, Col } from 'antd';

const { Title } = Typography;

// Container Styles
export const PageContainer = styled.div<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#141414' : '#f0f2f5'};
  min-height: 100vh;
  padding: 24px;
  color: ${props => props.isDarkMode ? 'white' : 'inherit'};
`;

export const CoverSection = styled.div<{ bgImage?: string; isDarkMode: boolean }>`
  height: 250px;
  background: ${props => props.bgImage
    ? `url(${props.bgImage}) center/cover`
    : props.isDarkMode
      ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
  overflow: hidden;
  
  &:hover {
    .edit-button {
      opacity: 1;
    }
  }
`;

export const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 8px 8px 0 0;
  
  &:hover {
    opacity: 1;
  }
`;

export const ProfileContent = styled.div`
  padding: 0 24px;
  margin-top: -80px;
  position: relative;
  z-index: 1;
`;

// Card Styles
export const ProfileCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  
  .ant-card-body {
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
`;

export const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border: ${props => props.isDarkMode ? '1px solid #434343' : 'none'};
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
  
  .ant-card-body {
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const EmergencyContactCard = styled(StyledCard)`
  .ant-card-head-title {
    font-weight: 600;
    font-size: 16px;
  }
  
  .ant-card-extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

// User Info Styles
export const UserInfoContainer = styled(Flex)`
  margin-top: 16px;
`;

export const UserInfo = styled.div`
  flex: 1;
  margin-left: 24px;
`;

export const UserName = styled(Title)<{ isDarkMode: boolean }>`
  margin-bottom: 0 !important;
  font-weight: 600 !important;
  color: ${props => props.isDarkMode ? 'white' : '#262626'} !important;
  font-size: 28px !important;
`;

export const UserDetailsVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

export const UserDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 14px;
`;

// Tab Styles
export const StyledTabs = styled(Tabs)<{ isDarkMode: boolean }>`
  margin-top: 24px;
  
  .ant-tabs-nav {
    margin-bottom: 0;
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'inherit'};
  }
  
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1890ff !important;
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background: #1890ff;
  }
`;

// Side Info Styles
export const SideInfoItem = styled.div<{ isDarkMode: boolean }>`
  margin-bottom: 16px;
  padding: 8px 0;
  
  .label {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : '#666'};
    margin-bottom: 4px;
    gap: 8px;
  }
  
  .value {
    color: ${props => props.isDarkMode ? 'white' : '#262626'};
    font-size: 16px;
  }
  
  a {
    color: ${props => props.isDarkMode ? '#1890ff' : '#1890ff'};
  }
`;

export const IconWrapper = styled.span<{ color: string }>`
  color: ${props => props.color};
  display: inline-flex;
  align-items: center;
`;

export const TabContent = styled(Row)`
  margin-top: 24px;
`;

export const TabIcon = styled.span<{ color: string }>`
  margin-right: 8px;
  color: ${props => props.color};
  display: inline-flex;
  align-items: center;
`;

export const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

// Contact Styles
export const ContactInfoContainer = styled.div<{ isDarkMode: boolean }>`
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#fafafa'};
  margin-bottom: 16px;
  position: relative;
  border: ${props => props.isDarkMode ? '1px solid #434343' : 'none'};
`;

export const ContactDetails = styled.div`
  margin-top: 8px;
  
  br {
    margin-bottom: 8px;
    display: block;
    content: '';
  }
`;

// Avatar Styles
export const AvatarEditOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1890ff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid white;
  opacity: 0;
  transition: opacity 0.3s;
  
  &:hover {
    background: #40a9ff;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover {
    ${AvatarEditOverlay} {
      opacity: 1;
    }
  }
`;

export const AvatarImage = styled(Avatar)`
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;



// Form Styles
export const FormItem = styled(Form.Item)<{ isDarkMode: boolean }>`
  .ant-form-item-label > label {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'inherit'};
  }
`;

// Image Modal Styles
export const ImageAdjustmentContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
`;

export const AdjustableImage = styled.img<{ offsetY: number }>`
  width: 100%;
  height: auto;
  min-height: 100%;
  object-fit: cover;
  transform: translateY(${props => props.offsetY}px);
  transition: transform 0.3s ease;
`;