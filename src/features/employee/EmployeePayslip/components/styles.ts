import styled from 'styled-components';
import { Card, Table } from 'antd';

export const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
    
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const StyledTable = styled(Table)`
  .ant-table {
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
    border-bottom: 2px solid #f0f0f0;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
      font-size: 12px;
    }
  }

  @media (max-width: 576px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 6px;
      font-size: 11px;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    
    .ant-input,
    .ant-select {
      width: 100% !important;
      margin-bottom: 8px;
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    
    .ant-input,
    .ant-select {
      width: 100% !important;
    }
  }
`;

export const StatsContainer = styled.div`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  @media (max-width: 576px) {
    padding: 2px 6px;
    font-size: 11px;
  }
`;