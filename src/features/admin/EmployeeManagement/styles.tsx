import styled from 'styled-components';
import { Layout, Card } from 'antd';

const { Content } = Layout;

export const StyledLayout = styled(Layout)`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

export const DashboardContent = styled(Content)`
  max-width: 1200px;
  margin: 0 auto;
`;

export const StatCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  
  .ant-card-body {
    padding: 20px;
  }
`;

export const DirectoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Container = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;