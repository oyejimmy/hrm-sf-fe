import React from 'react';
import { Button, Breadcrumb, Typography, Space, Flex } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components
const StyledPageHeader = styled.div<{ isDarkMode: boolean }>`
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#141414' : '#ffffff')};
  color: ${({ isDarkMode }) => (isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)')};
  border-bottom: 1px solid ${({ isDarkMode }) => (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0')};
  padding: 16px 24px;
  margin-bottom: 16px;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 12px 16px;
    
    .header-extra {
      margin-top: 12px;
      width: 100%;
      
      .ant-space {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 16px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface HeaderComponentProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  extraButtons?: React.ReactNode[];
  actions?: React.ReactNode; // Add this line
  isDarkMode: boolean;
  onBack?: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  subtitle,
  breadcrumbItems,
  actions,
  isDarkMode,
  onBack,
}) => {
  return (
    <StyledPageHeader isDarkMode={isDarkMode}>
      {onBack && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ marginBottom: 8, paddingLeft: 0 }}
        >
          Back
        </Button>
      )}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <BreadcrumbContainer>
          <Breadcrumb
            items={breadcrumbItems.map((item) => ({
              title: item.href ? <a href={item.href}>{item.title}</a> : item.title,
            }))}
          />
        </BreadcrumbContainer>
      )}
      <Flex align="center" justify="space-between" wrap="wrap">
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
        {actions && <div className="header-extra">{actions}</div>}
      </Flex>
    </StyledPageHeader>
  );
};

export default HeaderComponent;