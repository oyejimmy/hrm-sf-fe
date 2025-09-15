import styled from "styled-components";
import { Card } from "antd";
import { css } from "styled-components";

export const PageContainer = styled.div<{ isDarkMode?: boolean }>`
  margin: auto;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const StyledCard = styled(Card) <{ $isDarkMode?: boolean; $isMobile?: boolean }>`
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: ${(props) =>
    props.$isDarkMode
      ? "0 4px 12px rgba(255, 255, 255, 0.05)"
      : "0 4px 12px rgba(0, 0, 0, 0.08)"};
  background: ${(props) => (props.$isDarkMode ? "#1f1f1f" : "#fff")};
  border: ${(props) => (props.$isDarkMode ? "1px solid #444" : "1px solid #f0f0f0")};
  
  .ant-card-head {
    border-bottom: ${(props) => (props.$isDarkMode ? "1px solid #444" : "1px solid #f0f0f0")};
    padding: 0 16px;
  }
  
  .ant-card-head-title {
    color: ${(props) => (props.$isDarkMode ? "#f0f0f0" : "#000")};
    font-weight: 600;
    padding: 16px 0;
  }
  .ant-card-body {
    padding: 24px;
  }

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      margin-bottom: 16px;
      .ant-card-body {
        padding: 16px;
      }
    `}
`;

export const GridRow = styled.div<{ minWidth?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => p.minWidth ?? 250}px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const StatCard = styled(Card) <{ bgColor: string }>`
  border-radius: 8px;
  background: ${props => props.bgColor};
  border: none;
  
  .ant-card-body {
    padding: 16px;
  }
`;