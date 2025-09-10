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
import { BellOutlined, ProfileOutlined } from '@ant-design/icons';
import type { EmployeeProfile } from '../types';
import styled, { css } from 'styled-components';
import { theme as appTheme } from '../../../../styles/theme';

const { Title, Paragraph } = Typography;

// Responsive breakpoints
const BREAKPOINTS = {
  MOBILE: 768,
  SMALL: 576,
} as const;

// Styled components
const StyledCard = styled(Card)<{ ismobile: string; mode: 'light' | 'dark' }>`
  border-radius: 12px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  border: 1px solid ${({ mode }) => appTheme[mode].colors.border};

  /* Backgrounds for modes */
  background: ${({ mode }) =>
    mode === 'dark' ? '#2f2f2f' : appTheme[mode].colors.surface};

  /* ✅ Soft tiny shadow on all sides */
  box-shadow: ${({ mode }) =>
    mode === 'dark'
      ? '0 2px 8px rgba(255, 255, 255, 0.8)'  /* darker for dark mode */
      : '0 2px 8px rgba(0, 0, 0, 0.10)'}; /* soft & light for light mode */

  .ant-card-body {
    padding: 24px;
  }

  ${({ ismobile }) =>
    ismobile === 'true' &&
    css`
      margin-bottom: 16px;
      .ant-card-body {
        padding: 16px;
      }
    `}
`;

const StyledRow = styled(Row)<{ ismobile: string }>`
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

const StyledTitle = styled(Title)<{ issmallscreen: string; mode: 'light' | 'dark' }>`
  margin: 0;
  font-size: 1.5rem;
  color: ${({ mode }) => appTheme[mode].colors.textPrimary} !important;

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      font-size: 1.3rem;
    `}
`;

const StyledParagraph = styled(Paragraph)<{ issmallscreen: string; mode: 'light' | 'dark' }>`
  margin: 0;
  color: ${({ mode }) => appTheme[mode].colors.textSecondary} !important;

  ${({ issmallscreen }) =>
    issmallscreen === 'true' &&
    css`
      font-size: 0.9rem;
    `}
`;

const StyledSpace = styled(Space)<{ ismobile: string; issmallscreen: string }>`
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

const StyledButton = styled(Button)<{ ismobile: string }>`
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

const WelcomeHeader: React.FC<Props> = ({ profile = mockProfile }) => {
  const { token } = theme.useToken();

  // ✅ Safe mode detection (dark/light)
  const mode: 'light' | 'dark' =
    token.colorBgBase === '#000000' || token.colorBgContainer === '#141414'
      ? 'dark'
      : 'light';

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
    <StyledCard ismobile={isMobile.toString()} mode={mode}>
      <StyledRow align="middle" justify="space-between" ismobile={isMobile.toString()}>
        <Col>
          <ProfileSection issmallscreen={isSmallScreen.toString()}>
            <Avatar size={64} src={profile.avatarUrl} />
            <div>
              <StyledTitle
                level={2}
                issmallscreen={isSmallScreen.toString()}
                mode={mode}
              >
                Welcome back, {profile.name}!
              </StyledTitle>
              <StyledParagraph
                issmallscreen={isSmallScreen.toString()}
                mode={mode}
              >
                {profile.designation} — {profile.department}
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
            <StyledButton icon={<BellOutlined />} size="large" ismobile={isMobile.toString()}>
              Notifications
            </StyledButton>
            <StyledButton
              icon={<ProfileOutlined />}
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
