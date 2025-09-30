import styled from 'styled-components';
import { Card, Button, List } from 'antd';

export const StatsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  
  .ant-card-body {
    padding: 20px;
  }
`;

export const ChartContainer = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 20px;
  }
`;

export const NotificationItem = styled(List.Item)`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0 !important;
  
  &:last-child {
    border-bottom: none !important;
  }
`;

export const QuickActionButton = styled(Button)`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;