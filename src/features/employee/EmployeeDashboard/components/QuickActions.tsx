import React from "react";
import { Button, Row, Col, Card } from "antd";
import { 
  User, 
  FileText, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Settings,
  Clock,
  Award,
  Building,
  Heart
} from "lucide-react";
import styled from "styled-components";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface Props {
  actions: QuickAction[];
  isDarkMode: boolean;
}

// Styled components
const StyledCard = styled(Card)<{ $isDarkMode: boolean }>`
  border-radius: 8px;
  height: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.$isDarkMode 
    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  background: ${props => props.$isDarkMode ? '#1f1f1f' : '#fff'};
  border: ${props => props.$isDarkMode ? '1px solid #444' : '1px solid #f0f0f0'};
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.$isDarkMode ? '#333' : '#f0f0f0'};
    padding: 16px 20px;
    flex-shrink: 0;
  }
  
  .ant-card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .ant-card-head-title {
    font-weight: 600;
    font-size: 16px;
    color: ${props => props.$isDarkMode ? '#f0f0f0' : '#262626'};
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 350px;
  }
`;

const QuickActionButton = styled(Button)<{ $isDarkMode: boolean }>`
  height: 80px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDarkMode ? '#333' : '#e8e8e8'};
  background: ${props => props.$isDarkMode ? '#2a2a2a' : '#fafafa'};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.$isDarkMode ? '#1890ff' : '#40a9ff'};
    background: ${props => props.$isDarkMode ? '#1f1f1f' : '#f5f5f5'};
    transform: translateY(-2px);
    box-shadow: ${props => props.$isDarkMode 
      ? '0 4px 8px rgba(24, 144, 255, 0.2)' 
      : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
  
  .ant-btn-icon {
    margin-bottom: 8px;
  }
  
  .ant-btn-loading-icon {
    display: flex;
    justify-content: center;
  }
`;

const IconWrapper = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${props => props.$isDarkMode ? '#1890ff20' : '#e6f7ff'};
  margin-bottom: 8px;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$isDarkMode ? '#1890ff' : '#1890ff'};
  }
`;

const ActionLabel = styled.span<{ $isDarkMode: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isDarkMode ? '#f0f0f0' : '#262626'};
  line-height: 1.2;
`;

// Default HR quick actions
export const defaultHRActions: QuickAction[] = [
  {
    id: 'time-off',
    label: 'Request Time Off',
    icon: <Calendar />,
    onClick: () => console.log('Request Time Off')
  },
  {
    id: 'payroll',
    label: 'View Payslip',
    icon: <DollarSign />,
    onClick: () => console.log('View Payslip')
  },
  {
    id: 'profile',
    label: 'Update Profile',
    icon: <User />,
    onClick: () => console.log('Update Profile')
  },
  {
    id: 'documents',
    label: 'My Documents',
    icon: <FileText />,
    onClick: () => console.log('My Documents')
  },
  {
    id: 'benefits',
    label: 'Benefits',
    icon: <Heart />,
    onClick: () => console.log('Benefits')
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: <Clock />,
    onClick: () => console.log('Attendance')
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <Award />,
    onClick: () => console.log('Performance')
  },
  {
    id: 'directory',
    label: 'Team Directory',
    icon: <Building />,
    onClick: () => console.log('Team Directory')
  }
];

const QuickActions: React.FC<Props> = ({ actions = defaultHRActions, isDarkMode }) => {
  return (
    <StyledCard 
      title="Quick Actions" 
      $isDarkMode={isDarkMode}
      extra={<Settings size={16} color={isDarkMode ? '#f0f0f0' : '#000'} />}
    >
      <Row gutter={[24, 24]}>
        {actions.map((action) => (
          <Col xs={12} sm={8} md={6} lg={8} xl={8} key={action.id}>
            <QuickActionButton 
              $isDarkMode={isDarkMode}
              onClick={action.onClick}
              block
              type="text"
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconWrapper $isDarkMode={isDarkMode}>
                  {action.icon}
                </IconWrapper>
                <ActionLabel $isDarkMode={isDarkMode}>
                  {action.label}
                </ActionLabel>
              </div>
            </QuickActionButton>
          </Col>
        ))}
      </Row>
    </StyledCard>
  );
};

export default QuickActions;