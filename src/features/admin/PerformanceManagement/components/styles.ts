import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 1rem;
  background: #f9fafc;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const StatusTag = styled.span<{ status: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  background: ${({ status }) =>
    status === "Finalized"
      ? "#52c41a"
      : status === "Submitted"
      ? "#1890ff"
      : "#faad14"};
`;
