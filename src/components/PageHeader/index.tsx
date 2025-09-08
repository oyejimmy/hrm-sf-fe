import React from 'react';
import { Button, Breadcrumb, Typography, Space, Flex } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components
const StyledPageHeader = styled.div`
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
  
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
  onBack?: () => void;
  showBackButton?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  subtitle,
  breadcrumbItems = [],
  extraButtons = [],
  onBack,
  showBackButton = false
}) => {
  const breadcrumb = breadcrumbItems.length > 0 ? (
    <BreadcrumbContainer>
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item
            key={index}
            href={item.href}
          >
            {item.title}
          </Breadcrumb.Item>
        ))}
        <Breadcrumb.Item>{title}</Breadcrumb.Item>
      </Breadcrumb>
    </BreadcrumbContainer>
  ) : null;

  return (
    <StyledPageHeader>
      {breadcrumb}
      <Flex justify="space-between" align="flex-start" wrap="wrap">
        <Flex align="center" gap="middle">
          {showBackButton && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack || (() => window.history.back())}
            />
          )}
          <TitleContainer>
            <Title level={2} style={{ margin: 0 }}>{title}</Title>
            {subtitle && <Text type="secondary">{subtitle}</Text>}
          </TitleContainer>
        </Flex>
        {extraButtons.length > 0 && (
          <div className="header-extra">
            <Space size="middle">
              {extraButtons}
            </Space>
          </div>
        )}
      </Flex>
    </StyledPageHeader>
  );
};

export default HeaderComponent;