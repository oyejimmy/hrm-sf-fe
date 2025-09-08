import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 24px;
  background-color: #f9f9fb;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

export const SectionHeader = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${({ theme }) => theme?.colors?.primary || "#262626"};
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;
