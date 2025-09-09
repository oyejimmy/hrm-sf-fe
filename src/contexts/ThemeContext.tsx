import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        <ConfigProvider
          theme={{
            algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            token: {
              colorPrimary: currentTheme.colors.primary,
              colorInfo: currentTheme.colors.info,
              colorSuccess: currentTheme.colors.success,
              colorWarning: currentTheme.colors.warning,
              colorError: currentTheme.colors.error,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};