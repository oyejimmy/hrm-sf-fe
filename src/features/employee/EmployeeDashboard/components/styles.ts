// EmployeeDashboard/styles.ts
import styled from "styled-components";
import { Card } from "antd";

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const SectionCard = styled(Card)`
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
`;

export const GridRow = styled.div<{ minWidth?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => p.minWidth ?? 250}px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;
