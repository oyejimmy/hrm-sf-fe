import styled from 'styled-components';

// Main Container styles
export const Container = styled.div`
  .ant-tabs-content-holder {
    margin-top: -1px !important;
  }
  .ant-tabs-tabpane {
    padding: 0 !important;
  }
`;

export const TabContainer = styled.div`
  margin-bottom: 24px;
`;

// StatusIndicator styles
export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusText = styled.span`
  font-size: 12px;
  color: #666;
`;

// Table container styles
export const FiltersContainer = styled.div`
  padding: 16px 0;
  margin-bottom: 16px;
`;

export const SearchContainer = styled.div`
  padding: 16px 0;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
`;

// Shared Empty State styles
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #8c8c8c;
`;

export const EmptyStateTitle = styled.h3`
  color: #8c8c8c;
  margin-bottom: 8px;
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  color: #d9d9d9;
`;

// LeaveDetailsModal styles
export const ModalSection = styled.div<{ background?: string; border?: string }>`
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.background || '#fafafa'};
  border-radius: 8px;
  border: 1px solid ${props => props.border || '#e8e8e8'};
`;

export const SectionTitle = styled.h4<{ color?: string }>`
  margin: 0 0 12px 0;
  color: ${props => props.color || '#1890ff'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FieldLabel = styled.span`
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FieldValue = styled.div<{ color?: string; weight?: number }>`
  font-weight: ${props => props.weight || 500};
  font-size: 14px;
  color: ${props => props.color || 'inherit'};
`;

export const ReasonBox = styled.div`
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  min-height: 60px;
  font-size: 14px;
  line-height: 1.5;
`;

// Table row styles (deprecated - no longer used)
export const TableRowStyles = `
  .pending-row {
    background-color: #fff7e6 !important;
  }
  .approved-row {
    background-color: #f6ffed !important;
  }
  .rejected-row {
    background-color: #fff1f0 !important;
  }
  .ant-table-tbody > tr:hover.pending-row > td,
  .ant-table-tbody > tr:hover.approved-row > td,
  .ant-table-tbody > tr:hover.rejected-row > td {
    background-color: #e6f7ff !important;
  }
`;