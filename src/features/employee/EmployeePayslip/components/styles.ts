import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px;
`;

export const SummaryWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const StyledTable = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
`;

export const HighlightedNet = styled.span`
  font-weight: bold;
  color: #1890ff;
  font-size: 16px;
`;
