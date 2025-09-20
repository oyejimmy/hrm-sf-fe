// components/EmployeePayslip/components/styles.tsx
import styled from 'styled-components';
import { Card, Table } from 'antd';

export const PageWrapper = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
  }
`;

export const SummaryWrapper = styled.div`
  margin-bottom: 24px;
`;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: ${(props: any) => props.theme.themeMode === 'light' ? '#f0f0f0' : '#262626'};
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
`;

export const ModalContent = styled.div`
  padding: 16px 0;
`;

export const HighlightedNet = styled.span`
  color: #52c41a;
  font-weight: bold;
`;

export const StyledCard = styled(Card)`
  margin-bottom: 24px;
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => `${props.$color}15`};
  color: ${(props) => props.$color};
  margin-bottom: 12px;
  
  @media (max-width: 576px) {
    width: 32px;
    height: 32px;
  }
`;

export const StatisticCard = styled(Card)`
  height: 100%;
  
  .ant-card-body {
    display: flex;
    flex-direction: column;
  }
  
  @media (max-width: 576px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
  
  .search-section {
    display: flex;
    align-items: center;
  }
  
  .filter-section {
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .search-section, .filter-section {
      width: 100%;
    }
    
    .search-section {
      margin-bottom: 8px;
    }
  }
  
  @media (max-width: 576px) {
    .search-section {
      > div {
        width: 100%;
      }
    }
    
    .filter-section {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      
      > div {
        width: 100%;
      }
    }
  }
`;