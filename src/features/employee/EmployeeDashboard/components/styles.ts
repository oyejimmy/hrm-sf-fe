import styled from "styled-components";
import { Card } from "antd";

export const PageContainer = styled.div`
  padding: 24px;
  margin: auto;
  background-color: #f5f5f5;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const SectionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  margin-bottom: 16px;
  background: #fff;
`;

export const GridRow = styled.div<{ minWidth?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => p.minWidth ?? 250}px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const StatCard = styled(Card)<{ bgColor: string }>`
  border-radius: 8px;
  background: ${props => props.bgColor};
  border: none;
  
  .ant-card-body {
    padding: 16px;
  }
`;