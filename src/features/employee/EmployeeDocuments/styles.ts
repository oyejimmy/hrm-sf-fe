import styled from 'styled-components';
import { Card } from 'antd';

export const DocumentCard = styled(Card)<{ isDarkMode?: boolean; fixedHeight?: boolean }>`
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  ${props => props.fixedHeight && 'height: 400px;'}
  
  &:hover {
    box-shadow: ${props => props.isDarkMode
      ? '0 6px 16px rgba(0, 0, 0, 0.5)'
      : '0 6px 16px rgba(0, 0, 0, 0.1)'};
  }
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }
`;

export const CategoryListItem = styled.div<{ isActive?: boolean; isDarkMode?: boolean }>`
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${props => 
    props.isActive 
      ? (props.isDarkMode ? '#1890ff20' : '#f0f7ff')
      : 'transparent'
  };
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => 
      props.isDarkMode ? '#ffffff10' : '#f5f5f5'
    };
  }
`;

export const PreviewContainer = styled.div`
  height: 400px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-direction: column;
  gap: 8px;
`;

export const ScrollableList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;