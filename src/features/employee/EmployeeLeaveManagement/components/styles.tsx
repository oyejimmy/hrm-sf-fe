import styled from 'styled-components';
import { Card, Button, Modal, Table } from 'antd';

export const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : '#fff'};
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 16px rgba(0,0,0,0.24)' 
    : '0 4px 12px rgba(0,0,0,0.08)'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.isDarkMode 
      ? '0 6px 20px rgba(0,0,0,0.32)' 
      : '0 6px 16px rgba(0,0,0,0.12)'};
  }

  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }

  .ant-card-head-title {
    font-weight: 600;
    font-size: 16px;
    color: ${props => props.isDarkMode ? '#e6e6e6' : 'var(--text-color)'};
  }
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const BalanceCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  margin-bottom: 12px;
`;

export const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => `${props.$color}15`};
  color: ${props => props.$color};
  margin-right: 16px;
`;

export const BalanceInfo = styled.div`
  flex: 1;
`;

export const NotificationCard = styled.div<{ $read: boolean; $priority: string }>`
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid ${props => 
    props.$priority === 'high' ? '#ff4d4f' :
    props.$priority === 'medium' ? '#faad14' : '#52c41a'
  };
  background: ${props => props.$read ? 'var(--surface)' : 'var(--surface-secondary)'};
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--surface-secondary);
    transform: translateY(-1px);
  }
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const NotificationContent = styled.div`
  margin-left: 32px;
`;

export const TimeStamp = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
`;

export const RecipientCard = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin: 4px 0;
  background: var(--surface);
`;

export const RecipientInfo = styled.div`
  margin-left: 8px;
  flex: 1;
`;

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
  }
  
  @media (max-width: 576px) {
    .ant-modal-body {
      padding: 16px;
    }
  }
`;

export const StatCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
`;

export const StatisticWrapper = styled.div`
  text-align: center;
`;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: var(--surface-secondary);
    font-weight: 600;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: var(--surface-hover) !important;
  }
`;