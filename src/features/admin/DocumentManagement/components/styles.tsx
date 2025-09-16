// styles.ts
import styled from 'styled-components';
import { Tabs } from 'antd';

export const Container = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const FilterCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);

  @media (max-width: 576px) {
    padding: 12px;
  }
`;

export const DocumentCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  overflow: hidden;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding: 0 16px;
    margin-bottom: 0;
    
    .ant-tabs-tab {
      padding: 12px 0;
      margin-right: 24px;
      
      .ant-tabs-tab-btn {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  @media (max-width: 576px) {
    .ant-tabs-nav {
      padding: 0 12px;
      
      .ant-tabs-tab {
        margin-right: 16px;
        font-size: 14px;
      }
    }
  }
`;