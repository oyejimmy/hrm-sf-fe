import React from "react";
import { Button, Row, Col } from "antd";
import { StyledCard } from "./styles";
import type { QuickAction } from "../types";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Zap } from "lucide-react";
import styled from "styled-components";

interface Props {
  actions: QuickAction[];
}

// Styled zap icon for the card header
const QuickActionsIcon = styled(Zap)<{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  color: ${props => props.isDarkMode ? '#f0f0f0' : '#000'};
`;

const QuickActions: React.FC<Props> = ({ actions }) => {
  const { isDarkMode } = useTheme();
  
  return (
  <StyledCard 
    title="Quick Actions" 
    $isDarkMode={isDarkMode}
    extra={<QuickActionsIcon isDarkMode={isDarkMode} />}
  >
    <Row gutter={[8, 8]}>
      {actions.map((a) => (
        <Col xs={12} sm={8} md={6} key={a.id}>
          <Button 
            icon={a.icon} 
            onClick={a.onClick} 
            block
            size="small"
            style={{ height: '40px', fontSize: '11px' }}
          >
            {a.label}
          </Button>
        </Col>
      ))}
    </Row>
  </StyledCard>
  );
};

export default QuickActions;
