import React from 'react';
import { Button, Breadcrumb, Typography, Space, Flex } from 'antd';
import { Home, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Styled Components with dark mode support
const StyledPageHeader = styled.div<{ isDarkMode?: boolean }>`
  background-color: ${props => props.isDarkMode ? '#141414' : '#ffffff'};
  border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  padding: 16px 24px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const BreadcrumbContainer = styled.div<{ isDarkMode?: boolean }>`
  margin-bottom: 16px;
  
  .ant-breadcrumb {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)'};
    
    a {
      color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)'};
      
      &:hover {
        color: ${props => props.isDarkMode ? '#1890ff' : '#40a9ff'};
      }
    }
    
    li:last-child {
      color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
    
    .ant-breadcrumb {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .ant-breadcrumb {
      font-size: 11px;
      
      /* Hide breadcrumb items except the last one on very small screens */
      li:not(:last-child) {
        display: none;
      }
      
      li:nth-last-child(2) {
        display: list-item;
        
        &::before {
          content: "...";
          margin: 0 4px;
        }
      }
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const HeaderContent = styled(Flex)`
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    
    .header-extra {
      width: 100%;
      
      .ant-space {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const TitleText = styled(Title) <{ isDarkMode?: boolean }>`
  margin: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'} !important;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
  }
  
  @media (max-width: 480px) {
    font-size: 18px !important;
    white-space: normal;
    line-height: 1.3 !important;
  }
`;

const SubtitleText = styled(Text) <{ isDarkMode?: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'} !important;
  
  @media (max-width: 480px) {
    font-size: 13px;
    white-space: normal;
  }
`;

const BackButton = styled(Button) <{ isDarkMode?: boolean }>`
  flex-shrink: 0;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'} !important;
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    height: auto;
    
    .ant-btn-icon {
      font-size: 14px;
    }
  }
`;

const ExtraButtonsContainer = styled(Space)`
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 8px !important;
    
    .ant-btn {
      padding: 4px 8px;
      height: auto;
      font-size: 13px;
    }
  }
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
  isDarkMode?: boolean;
}

const HeaderComponent = ({
  title,
  subtitle,
  breadcrumbItems = [],
  extraButtons = [],
  onBack,
  showBackButton = false,
  isDarkMode = false
}: HeaderComponentProps) => {
  const breadcrumb = breadcrumbItems.length > 0 ? (
    <BreadcrumbContainer isDarkMode={isDarkMode}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <Home
            size={14}
            style={{
              marginRight: 4,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)'
            }}
          />
          Home
        </Breadcrumb.Item>
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
    <StyledPageHeader isDarkMode={isDarkMode}>
      {breadcrumb}
      <HeaderContent justify="space-between" align="flex-start" wrap="wrap">
        <Flex align="center" gap="middle" style={{ flex: 1, minWidth: 0 }}>
          {showBackButton && (
            <BackButton
              type="text"
              icon={
                <ArrowLeft
                  size={16}
                  color={isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'}
                />
              }
              onClick={onBack || (() => window.history.back())}
              isDarkMode={isDarkMode}
            />
          )}
          <TitleContainer style={{ minWidth: 0 }}>
            <TitleText
              level={2}
              isDarkMode={isDarkMode}
            >
              {title}
            </TitleText>
            {subtitle && (
              <SubtitleText
                type={isDarkMode ? "secondary" : "secondary"}
                isDarkMode={isDarkMode}
              >
                {subtitle}
              </SubtitleText>
            )}
          </TitleContainer>
        </Flex>

        {extraButtons && extraButtons.length > 0 && (
          <div className="header-extra" style={{ flexShrink: 0 }}>
            <ExtraButtonsContainer size="middle" wrap>
              {extraButtons.map((button, index) => (
                <React.Fragment key={index}>
                  {button}
                </React.Fragment>
              ))}
            </ExtraButtonsContainer>
          </div>
        )}
      </HeaderContent>
    </StyledPageHeader>
  );
};

export default HeaderComponent;