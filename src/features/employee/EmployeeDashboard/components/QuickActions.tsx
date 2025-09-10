import React from "react";
import { Button } from "antd";
import { StyledCard, GridRow } from "./styles";
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
    <GridRow minWidth={140}>
      {actions.map((a) => (
        <Button key={a.id} icon={a.icon} onClick={a.onClick} block>
          {a.label}
        </Button>
      ))}
    </GridRow>
  </StyledCard>
  );
};

export default QuickActions;
