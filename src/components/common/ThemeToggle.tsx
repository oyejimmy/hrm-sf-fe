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
  margin-left: 8px;
  
  @media (max-width: 768px) {
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