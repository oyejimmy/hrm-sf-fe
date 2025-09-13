import styled from 'styled-components';
import { Layout, Card, Button } from 'antd';

const { Header, Content } = Layout;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-color: #f5f7fa;
`;

export const StyledHeader = styled(Header)`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  display: flex;
  align-items: center;
  z-index: 1;
`;

export const DashboardContent = styled(Content)`
  padding: 24px;
`;

export const StatisticCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  .ant-card-body {
    padding: 20px;
  }
`;

export const SectionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-card-head-title {
    font-weight: 600;
    color: #262626;
  }
`;

export const QuickActionButton = styled(Button)`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  transition: all 0.3s;
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

export const ItemContainer = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;