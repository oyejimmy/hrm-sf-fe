import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    themeMode: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      background: string;
      surface: string;
      surfaceSecondary: string;
      textPrimary: string;
      textSecondary: string;
      textDisabled: string;
      border: string;
      borderLight: string;
      statusActive: string;
      statusInactive: string;
      statusSuspended: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
      fontWeight: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
    };
    zIndex: {
      dropdown: number;
      sticky: number;
      fixed: number;
      modalBackdrop: number;
      modal: number;
      popover: number;
      tooltip: number;
    };
  }
}