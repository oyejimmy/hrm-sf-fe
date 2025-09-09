import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  margin-left: ${props => props.theme?.spacing?.sm || '8px'};
  color: ${props => props.theme?.colors?.secondary || '#C49629'};
  
  &:hover {
    color: ${props => props.theme?.colors?.primary || '#2958C4'};
    background-color: ${props => props.theme?.colors?.surfaceSecondary || '#fafafa'};
  }
  
  @media (max-width: ${props => props.theme?.breakpoints?.md || '768px'}) {
    width: 28px;
    height: 28px;
  }
`;

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <ThemeButton 
        type="text" 
        onClick={toggleTheme}
        className={className}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <BulbFilled /> : <BulbOutlined />}
      </ThemeButton>
    </Tooltip>
  );
};