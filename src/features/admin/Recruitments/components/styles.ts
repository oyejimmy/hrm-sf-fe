import styled from "styled-components";

// Container for whole module
export const PageContainer = styled.div`
  padding: 1rem;
  background: #fafafa;
  min-height: 100vh;
`;

// Header wrapper
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// Responsive form grid
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Styled status tag colors
export const StatusTag = styled.span<{ status: string }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: white;
  background: ${({ status }) =>
    status === "Open"
      ? "#52c41a"
      : status === "Closed"
      ? "#f5222d"
      : "#faad14"};
`;

// Table wrapper for responsive
export const TableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;
