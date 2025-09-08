// AdminDashboard/styles.ts
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
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  margin-bottom: 16px;
`;

export const GridRow = styled.div<{ gap?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p: any) => p.gap ?? 240}px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

export const SmallStat = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
`;
