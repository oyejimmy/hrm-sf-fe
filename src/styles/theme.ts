// Light theme colors
const lightTheme = {
  themeMode: 'light' as const,
  colors: {
    primary: '#2958C4',
    secondary: '#C49629',
    component: '#3D4C6F',
    monochromatic: {
      primary: '#2958C4',
      secondary: '#3D4C6F',
      tertiary: '#2D2F33',
    },
    success: '#52c41a',
    warning: '#C49629',
    error: '#ff4d4f',
    info: '#2958C4',
    
    // Background colors
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceSecondary: '#fafafa',
    
    // Text colors
    textPrimary: '#2D2F33',
    textSecondary: '#3D4C6F',
    textDisabled: '#bfbfbf',
    
    // Border colors
    border: '#d9d9d9',
    borderLight: '#f0f0f0',
    
    // Status colors
    statusActive: '#52c41a',
    statusInactive: '#C49629',
    statusSuspended: '#ff4d4f',
  },
};

// Dark theme colors
const darkTheme = {
  themeMode: 'dark' as const,
  colors: {
    primary: '#2958C4',
    secondary: '#C49629',
    component: '#3D4C6F',
    monochromatic: {
      primary: '#2958C4',
      secondary: '#3D4C6F',
      tertiary: '#2D2F33',
    },
    success: '#52c41a',
    warning: '#C49629',
    error: '#ff4d4f',
    info: '#2958C4',
    
    // Background colors
    background: '#141414',
    surface: '#1f1f1f',
    surfaceSecondary: '#262626',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#d9d9d9',
    textDisabled: '#595959',
    
    // Border colors
    border: '#434343',
    borderLight: '#303030',
    
    // Status colors
    statusActive: '#52c41a',
    statusInactive: '#C49629',
    statusSuspended: '#ff4d4f',
  },
};

// Shared theme properties
const sharedTheme = {
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

export const theme = {
  light: {
    ...lightTheme,
    ...sharedTheme,
  },
  dark: {
    ...darkTheme,
    ...sharedTheme,
  },
};

// Export individual themes for direct use
export { lightTheme, darkTheme };
