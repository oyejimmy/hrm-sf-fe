import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';

// Define theme types
export type ThemeMode = 'light' | 'dark';

// Light theme colors
const lightTheme = {
  themeMode: 'light',
  colors: {
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    
    // Background colors
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceSecondary: '#fafafa',
    
    // Text colors
    textPrimary: '#262626',
    textSecondary: '#8c8c8c',
    textDisabled: '#bfbfbf',
    
    // Border colors
    border: '#d9d9d9',
    borderLight: '#f0f0f0',
    
    // Status colors
    statusActive: '#52c41a',
    statusInactive: '#faad14',
    statusSuspended: '#ff4d4f',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// Dark theme colors
const darkTheme = {
  ...lightTheme,
  themeMode: 'dark',
  colors: {
    ...lightTheme.colors,
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    
    // Background colors
    background: '#141414',
    surface: '#1f1f1f',
    surfaceSecondary: '#262626',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#a6a6a6',
    textDisabled: '#6c6c6c',
    
    // Border colors
    border: '#434343',
    borderLight: '#303030',
    
    // Status colors remain the same for consistency
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
  },
};

// Ant Design theme configurations
const antLightTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
  },
};

const antDarkTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
  },
  algorithm: 'dark',
};

// Theme context interface
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  theme: typeof lightTheme;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  toggleTheme: () => {},
  theme: lightTheme,
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get theme preference from localStorage or default to light
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return (savedTheme as ThemeMode) || 'light';
  });

  // Set the current theme based on themeMode
  const theme = {
    ...(themeMode === 'light' ? lightTheme : darkTheme),
    themeMode
  };
  const antTheme = themeMode === 'light' ? antLightTheme : antDarkTheme;

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Update document body class when theme changes
  useEffect(() => {
    document.body.className = themeMode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, theme }}>
      <StyledThemeProvider theme={theme}>
        <ConfigProvider theme={antTheme}>
          {children}
        </ConfigProvider>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};