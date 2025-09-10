import React from 'react';
import {
  Avatar,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Space,
  theme,
} from 'antd';
import { Bell, User } from 'lucide-react';
import type { EmployeeProfile } from '../types';
import styled, { css } from 'styled-components';
import { theme as appTheme } from '../../../../styles/theme';
import { StyledCard } from './styles';

const { Title, Paragraph } = Typography;

// Responsive breakpoints
const BREAKPOINTS = {
  MOBILE: 768,
  SMALL: 576,
} as const;

const StyledRow = styled(Row) <{ ismobile: string }>`
  flex-wrap: nowrap;

  ${({ ismobile }) =>
    ismobile === 'true' &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    `}
`;

const ProfileSection = styled.div<{ issmallscreen: string }>`
  display: flex;
  align-items: center;
  gap: 16px;

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    `}
`;

const StyledTitle = styled(Title) <{ issmallscreen: string; isDarkMode: boolean }>`
  margin: 0;
  font-size: 1.5rem;
  color: ${({ isDarkMode }) => appTheme[isDarkMode ? 'dark' : 'light'].colors.textPrimary} !important;

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      font-size: 1.3rem;
    `}
`;

const StyledParagraph = styled(Paragraph) <{ issmallscreen: string; isDarkMode: boolean }>`
  margin: 0;
  color: ${({ isDarkMode }) => appTheme[isDarkMode ? 'dark' : 'light'].colors.textSecondary} !important;

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      font-size: 0.9rem;
    `}
`;

const StyledSpace = styled(Space) <{ ismobile: string; issmallscreen: string }>`
  display: flex;
  gap: 12px;

  ${({ ismobile }) =>
    ismobile === 'true' &&
    css`
      width: 100%;
      justify-content: space-between;
    `}

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      flex-direction: column;
      width: 100%;
      gap: 8px;
    `}
`;

const StyledButton = styled(Button) <{ ismobile: string }>`
  ${({ ismobile }) =>
    ismobile === 'true' &&
    css`
      width: 100%;
    `}
`;

interface Props {
  profile?: EmployeeProfile;
}

// Mock data
const mockProfile: EmployeeProfile = {
  name: 'Sarah Johnson',
  designation: 'Senior UX Designer',
  department: 'Product Development',
  avatarUrl: 'https://i.pravatar.cc/150?img=5',
};

const WelcomeHeader = ({ isDarkMode }: { isDarkMode: boolean }) => {

  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width <= BREAKPOINTS.MOBILE;
  const isSmallScreen = windowSize.width <= BREAKPOINTS.SMALL;

  return (
    <StyledCard $isMobile={isMobile} $isDarkMode={isDarkMode}>
      <StyledRow align="middle" justify="space-between" ismobile={isMobile.toString()}>
        <Col>
          <ProfileSection issmallscreen={isSmallScreen.toString()}>
            <Avatar size={64} src={mockProfile.avatarUrl} />
            <div>
              <StyledTitle
                level={2}
                issmallscreen={isSmallScreen.toString()}
                isDarkMode={isDarkMode}
              >
                Welcome back, {mockProfile.name}!
              </StyledTitle>
              <StyledParagraph
                issmallscreen={isSmallScreen.toString()}
                isDarkMode={isDarkMode}
              >
                {mockProfile.designation} — {mockProfile.department}
              </StyledParagraph>
            </div>
          </ProfileSection>
        </Col>
        <Col>
          <StyledSpace
            ismobile={isMobile.toString()}
            issmallscreen={isSmallScreen.toString()}
            direction={isSmallScreen ? 'vertical' : 'horizontal'}
            size="middle"
          >
            <StyledButton icon={<Bell size={16} color={isDarkMode ? '#f0f0f0' : '#000'} />} size="large" ismobile={isMobile.toString()}>
              Notifications
            </StyledButton>
            <StyledButton
              icon={<User size={16} />}
              type="primary"
              size="large"
              ismobile={isMobile.toString()}
            >
              Profile
            </StyledButton>
          </StyledSpace>
        </Col>
      </StyledRow>
    </StyledCard>
  );
};

export default WelcomeHeader;
