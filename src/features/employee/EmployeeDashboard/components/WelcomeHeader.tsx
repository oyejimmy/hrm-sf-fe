import {
  Avatar,
  Button,
  Typography,
  Badge,
  Flex,
} from 'antd';
import { User, MapPin, Briefcase, Bell, Smile } from 'lucide-react';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components with theme support
const HeaderContainer = styled.div<{ isDarkMode: boolean }>`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  margin-bottom: 24px;
  background: ${props => props.isDarkMode ? '#141414' : 'white'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
`;

const CoverSection = styled.div<{ isDarkMode: boolean }>`
  height: 160px;
  background: url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3") center/cover no-repeat;
  position: relative;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ProfileContent = styled.div<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#141414' : 'white'};
  padding: 24px;
  padding-top: 60px;
  position: relative;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  
  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 50px;
  }
`;

const AvatarContainer = styled.div<{ isDarkMode: boolean }>`
  position: absolute;
  top: -70px;
  left: 24px;
  border: 4px solid ${props => props.isDarkMode ? '#141414' : 'white'};
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
  
  @media (max-width: 768px) {
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const UserInfoContainer = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const UserProfileSection = styled(Flex)`
  gap: 16px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    margin-top: 20px;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 140px; /* Account for avatar width + gap */
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    align-items: center;
  }
`;

const UserName = styled(Title) <{ isDarkMode: boolean }>`
  margin: 0 !important;
  font-weight: 600 !important;
  font-size: 1.8rem !important;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'} !important;
  
  @media (max-width: 768px) {
    font-size: 1.5rem !important;
  }
`;

const UserSubInfo = styled(Flex) <{ isDarkMode: boolean }>`
  gap: 16px;
  display: block;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : '#666'};
  font-size: 1rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: center;
    gap: 12px;
  }
`;

const InfoItem = styled(Flex) <{ isDarkMode: boolean }>`
  align-items: center;
  gap: 4px;
`;

const StyledIconWrapper = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  margin-right: 6px;
`;

const CenterMessage = styled.div<{ isDarkMode: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'};
  text-align: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    margin-top: 12px;
    order: 3;
  }
`;

const ActionButtons = styled(Flex) <{ isDarkMode: boolean }>`
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const StyledButton = styled(Button) <{ isDarkMode: boolean }>` 
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  font-weight: 500;
`;

const ProfileButton = styled(StyledButton) <{ isDarkMode: boolean }>`
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;

  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;

const NotificationButton = styled(StyledButton) <{ isDarkMode: boolean }>`
  background-color: ${props => props.isDarkMode ? '#2a2a2a' : '#f5f5f5'};
  border-color: ${props => props.isDarkMode ? '#434343' : '#d9d9d9'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};

  &:hover {
    background-color: ${props => props.isDarkMode ? '#373737' : '#e6e6e6'};
    border-color: ${props => props.isDarkMode ? '#434343' : '#d9d9d9'};
  }
`;

const ProfileInfoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 160px;
  z-index: 2;
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    text-align: center;
    margin-top: 70px;
    margin-bottom: 16px;
  }
`;

// Mock user data
const userData = {
  name: "Jami Ur Rahman",
  role: "COO",
  location: "London",
  welcomeMessage: "Welcome back, Jamil Ur Rahman!",
  position: "Senior UX Designer",
  avatarUrl:
    "https://images.unsplash.com/photo-1623170909888-4e97ff277186?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEJveXxlbnwwfHwwfHx8MA%3D%3D",
};

const WelcomeHeader = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <HeaderContainer isDarkMode={isDarkMode}>
      <CoverSection isDarkMode={isDarkMode} />

      <ProfileContent isDarkMode={isDarkMode}>
        <AvatarContainer isDarkMode={isDarkMode}>
          <Avatar size={120} src={userData.avatarUrl} />
        </AvatarContainer>

        {/* Centered Welcome Message */}
        <CenterMessage isDarkMode={isDarkMode}>
          {userData.welcomeMessage}
        </CenterMessage>

        {/* Profile info near the profile picture */}
        <ProfileInfoContainer>
          <UserName level={4} style={{ margin: 0 }} isDarkMode={isDarkMode}>
            {userData.name}
          </UserName>
          <UserSubInfo isDarkMode={isDarkMode}>
            <InfoItem isDarkMode={isDarkMode}>
              <StyledIconWrapper color="#1890ff">
                <Briefcase size={14} />
              </StyledIconWrapper>
              <Text>{userData.role}</Text>
            </InfoItem>
            <InfoItem isDarkMode={isDarkMode}>
              <StyledIconWrapper color="#f5222d">
                <MapPin size={14} />
              </StyledIconWrapper>
              <Text>{userData.location}</Text>
            </InfoItem>
          </UserSubInfo>
          <Text strong style={{
            marginTop: '4px',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : '#555',
            fontSize: '0.9rem'
          }}>
            {userData.position}
          </Text>
        </ProfileInfoContainer>

        <UserInfoContainer>
          <UserProfileSection>
            <div style={{ width: '120px', flexShrink: 0 }} />
            <UserDetails>
              {/* Empty space where the welcome message used to be */}
            </UserDetails>
          </UserProfileSection>

          <ActionButtons isDarkMode={isDarkMode}>
            <ProfileButton isDarkMode={isDarkMode} icon={<User size={16} />}>
              Profile
            </ProfileButton>
          </ActionButtons>
        </UserInfoContainer>
      </ProfileContent>
    </HeaderContainer>
  );
};

export default WelcomeHeader;