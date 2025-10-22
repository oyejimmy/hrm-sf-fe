import styled from "styled-components";
import { Modal, Card } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
  }
`;

export const SummaryContainer = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

export const AssetCard = styled(Card)`
  text-align: center;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const IconContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AssetCount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
`;

export const TipContainer = styled.div`
  margin-top: 20px;
  padding: 12px;
  background: #e6f7ff;
  border-radius: 6px;
  text-align: center;
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #fafafa;
  border-radius: 8px;
`;

export const EmptyIconContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`;

export const ActivityCard = styled(Card)`
  height: 300px;
  
  .scrollable-content {
    height: 220px;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
  }
  
  &:hover .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }
  
  &:hover .scrollable-content::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;
  }
  
  &:hover .scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
`;