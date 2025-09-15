import styled from 'styled-components';
import { Card } from 'antd';

export const Container = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

export const StatsCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
  
  .ant-statistic-title {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    font-size: 24px;
    font-weight: 600;
  }
`;

export const FilterCard = styled(Card)`
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 16px 24px;
  }
`;

export const JobsCard = styled(Card)`
  .ant-card-head {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.surfaceSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const ModalContent = styled.div`
  .ant-form-item-label > label {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }
  
  .ant-descriptions-item-label {
    background: ${({ theme }) => theme.colors.surfaceSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }
`;