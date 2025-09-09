// EmployeeDashboard/styles.ts
import styled from "styled-components";
import { Card } from "antd";

export const PageContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: auto;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

export const SectionCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
`;

export const GridRow = styled.div<{ minWidth?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => p.minWidth ?? 250}px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;
