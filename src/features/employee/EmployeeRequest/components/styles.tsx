import styled from 'styled-components';
import { Card, Tabs, Button, Modal } from 'antd';

export const StyledCard = styled(Card)<{ isDarkMode?: boolean }>`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  margin-bottom: 24px;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
    
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const StyledTabs = styled(Tabs)<{ isDarkMode?: boolean }>`
  .ant-tabs-nav {
    margin-bottom: 24px;
    
    &::before {
      border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    }
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-weight: 500;
    
    &:hover {
      color: #1890ff;
    }
    
    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #1890ff;
      font-weight: 600;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #1890ff;
  }

  @media (max-width: 768px) {
    .ant-tabs-nav {
      margin-bottom: 16px;
    }
    
    .ant-tabs-tab {
      padding: 8px 12px;
      font-size: 14px;
    }
  }
`;

export const StyledButton = styled(Button)<{ isDarkMode?: boolean }>`
  border-radius: 8px;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

export const PrimaryButton = styled(StyledButton)`
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
    color: white;
  }
`;

export const SecondaryButton = styled(StyledButton)`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'};
  border-color: #d9d9d9;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

export const StyledModal = styled(Modal)<{ isDarkMode?: boolean }>`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    padding: 20px 24px;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-modal-footer {
    border-top: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    padding: 16px 24px;
  }

  @media (max-width: 768px) {
    width: 95% !important;
    max-width: none;
    
    .ant-modal-body {
      padding: 16px;
    }
  }
`;

export const RequestCard = styled(StyledCard)`
  margin-bottom: 0;
  
  .ant-card-body {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  @media (max-width: 1200px) {
    .ant-card-body {
      padding: 16px;
    }
  }
  
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

export const GridContainer = styled.div<{ isDarkMode?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 16px 0;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;