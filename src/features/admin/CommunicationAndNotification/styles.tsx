import styled from 'styled-components';
import { Card, Tag, Badge, Button } from 'antd';

export const Container = styled.div`
  padding: 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

export const SectionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 24px;
  
  .ant-card-head {
    border-bottom: 1px solid #e8e8e8;
  }
`;

export const MessageItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const NotificationBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #3b82f6;
  }
`;

export const PriorityTag = styled(Tag)<{ priority: string }>`
  border: none;
  font-weight: 500;
  
  ${({ priority }) => {
    switch (priority) {
      case 'high':
        return `background-color: #fee2e2; color: #dc2626;`;
      case 'medium':
        return `background-color: #fef3c7; color: #d97706;`;
      case 'low':
        return `background-color: #d1fae5; color: #059669;`;
      default:
        return `background-color: #e5e7eb; color: #4b5563;`;
    }
  }}
`;

export const StatusIndicator = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  
  ${({ status }) => {
    switch (status) {
      case 'read':
        return `background-color: #10b981;`;
      case 'unread':
        return `background-color: #3b82f6;`;
      case 'archived':
        return `background-color: #6b7280;`;
      default:
        return `background-color: #e5e7eb;`;
    }
  }}
`;

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
`;