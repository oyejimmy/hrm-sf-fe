import React from 'react';
import { Button, Breadcrumb, Typography, Space, Flex } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// Destructuring Typography components for easier use
const { Title, Text } = Typography;

// Styled component for the main page header container
const StyledPageHeader = styled.div<{ isDarkMode: boolean }>`
  background-color: ${({ isDarkMode }: any) => (isDarkMode ? '#141414' : '#ffffff')};
  color: ${({ isDarkMode }: any) => (isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)')};
  border: 1px solid ${({ isDarkMode }: any) => (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0')};
  padding: 16px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

// Styled component for the breadcrumb navigation container
const BreadcrumbContainer = styled.div`
  margin-bottom: 16px;
`;

// Styled component for the title and subtitle container
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Styled component for the back button
const BackButton = styled(Button)`
  margin-bottom: 8px;
  padding-left: 0;
`;

// Styled component for the flexible header layout, handling wrapping and spacing
const HeaderFlex = styled(Flex)`
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Styled component for the extra content (buttons, actions) container
const ExtraContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

// Interface for a single breadcrumb item
interface BreadcrumbItem {
  title: string;
  // Optional URL for the breadcrumb item
  href?: string; 
}
// Interface for the props of the HeaderComponent
interface HeaderComponentProps {
  // Main title of the page header
  title: string;
  // Optional subtitle
  subtitle?: string;
  // Optional array of breadcrumb items
  breadcrumbItems?: BreadcrumbItem[];
  // Optional array of extra buttons (React nodes)
  extraButtons?: React.ReactNode[];
  // Optional actions (React node)
  actions?: React.ReactNode;
  // Optional flag for dark mode styling
  isDarkMode: boolean;
  // Optional callback function for the back button
  onBack?: () => void;
}

// Functional component for the PageHeader
const HeaderComponent = ({
  title,
  subtitle,
  breadcrumbItems,
  extraButtons,
  actions,
  isDarkMode,
  onBack,
}: HeaderComponentProps) => {
  // Determine if breadcrumbs are present
  const hasBreadcrumbs = breadcrumbItems?.length;
  // Determine if extra content (buttons or actions) is present
  const hasExtras = (extraButtons && extraButtons.length > 0) || actions;

  return (
    // Main container for the page header, applies dark mode styling if enabled
    <StyledPageHeader isDarkMode={isDarkMode}>
      {/* Render back button if onBack function is provided */}
      {onBack && (
        <BackButton type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>
          Back
        </BackButton>
      )}
      {/* Render breadcrumbs if present */}
      {hasBreadcrumbs && (
        <BreadcrumbContainer>
          <Breadcrumb
            items={breadcrumbItems!.map(({ title, href }) => ({
              title: href ? <a href={href}>{title}</a> : title, // Render as link if href exists, otherwise as plain text
            }))}
          />
        </BreadcrumbContainer>
      )}
      {/* Flexible container for title/subtitle and extra content, with space-between justification */}
      <HeaderFlex justify="space-between" align="center">
        {/* Container for the main title and optional subtitle */}
        <TitleContainer>
          <Title level={3} style={{ margin: 0, color: 'inherit' }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ color: 'inherit' }}>
              {subtitle}
            </Text> 
          )}
        </TitleContainer>
        {/* Render extra content if present */}
        {hasExtras && (
          <ExtraContainer className="header-extra">
            <Space wrap>
              {/* Map and render extra buttons */}
              {extraButtons?.map((button, index) => (
                <React.Fragment key={index}>{button}</React.Fragment>
              ))}
              {/* Render additional actions */}
              {actions}
            </Space>
          </ExtraContainer>
        )}
      </HeaderFlex>
    </StyledPageHeader>
  );
};

export default HeaderComponent;
