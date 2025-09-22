import styled from 'styled-components';
import { Card } from 'antd';

export const ComplaintCard = styled(Card)<{ isDarkMode?: boolean }>`
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  
  &:hover {
    box-shadow: ${props => props.isDarkMode
      ? '0 6px 16px rgba(0, 0, 0, 0.5)'
      : '0 6px 16px rgba(0, 0, 0, 0.1)'};
  }
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }
`;

export const FormContainer = styled.div<{ isDarkMode?: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  padding: 24px;
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
`;