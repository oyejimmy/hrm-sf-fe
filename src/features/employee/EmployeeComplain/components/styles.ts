import styled from 'styled-components';
import { Card } from 'antd';

export const ComplaintFormWrapper = styled(Card)`
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
`;

export const ComplaintHistoryTableWrapper = styled(Card)`
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
`;

export const ComplaintDetailsModalWrapper = styled.div`
  .ant-modal-body {
    padding: 24px;
  }
`;