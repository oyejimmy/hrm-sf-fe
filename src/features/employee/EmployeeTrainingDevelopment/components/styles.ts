import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 24px;
  background-color: #f9f9f9;
`;

export const SectionTitle = styled.h2`
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: bold;
  color: #333;
`;

export const ResourceCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;

export const FeedbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
