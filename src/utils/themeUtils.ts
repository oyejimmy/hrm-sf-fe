import { theme } from '../styles/theme';

// Theme utility functions for consistent color usage
export const getThemeColor = (colorKey: string, mode: 'light' | 'dark' = 'light') => {
  const currentTheme = mode === 'dark' ? theme.dark : theme.light;
  
  // Handle nested color paths like 'monochromatic.primary'
  const keys = colorKey.split('.');
  let color: any = currentTheme.colors;
  
  for (const key of keys) {
    color = color[key];
    if (!color) break;
  }
  
  return color || currentTheme.colors.primary;
};

// Status color mappings using theme colors
export const getStatusColor = (status: string, mode: 'light' | 'dark' = 'light') => {
  const currentTheme = mode === 'dark' ? theme.dark : theme.light;
  
  switch (status.toLowerCase()) {
    case 'active':
    case 'approved':
    case 'completed':
      return currentTheme.colors.success;
    case 'pending':
    case 'in_progress':
      return currentTheme.colors.warning;
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return currentTheme.colors.error;
    case 'draft':
    case 'inactive':
      return currentTheme.colors.textSecondary;
    default:
      return currentTheme.colors.primary;
  }
};

// Role color mappings using theme colors
export const getRoleColor = (role: string, mode: 'light' | 'dark' = 'light') => {
  const currentTheme = mode === 'dark' ? theme.dark : theme.light;
  
  switch (role.toLowerCase()) {
    case 'admin':
      return currentTheme.colors.error;
    case 'hr':
      return currentTheme.colors.warning;
    case 'team_lead':
      return currentTheme.colors.primary;
    case 'employee':
      return currentTheme.colors.success;
    default:
      return currentTheme.colors.textSecondary;
  }
};

// Priority color mappings
export const getPriorityColor = (priority: string, mode: 'light' | 'dark' = 'light') => {
  const currentTheme = mode === 'dark' ? theme.dark : theme.light;
  
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return currentTheme.colors.error;
    case 'medium':
      return currentTheme.colors.warning;
    case 'low':
      return currentTheme.colors.success;
    default:
      return currentTheme.colors.textSecondary;
  }
};

// Generate gradient backgrounds using theme colors
export const getGradientBackground = (startColor: string, endColor: string) => {
  return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
};

// Common gradient combinations using theme colors
export const getThemeGradients = (mode: 'light' | 'dark' = 'light') => {
  const currentTheme = mode === 'dark' ? theme.dark : theme.light;
  
  return {
    primary: getGradientBackground(currentTheme.colors.primary, currentTheme.colors.secondary),
    success: getGradientBackground(currentTheme.colors.success, currentTheme.colors.primary),
    warning: getGradientBackground(currentTheme.colors.warning, currentTheme.colors.secondary),
    error: getGradientBackground(currentTheme.colors.error, currentTheme.colors.primary),
    monochromatic: getGradientBackground(
      currentTheme.colors.monochromatic.primary, 
      currentTheme.colors.monochromatic.secondary
    ),
  };
};

// Export theme constants for direct use
export const THEME_COLORS = {
  PRIMARY: '#2958C4',
  SECONDARY: '#C49629',
  COMPONENT: '#3D4C6F',
  MONOCHROMATIC: {
    PRIMARY: '#2958C4',
    SECONDARY: '#3D4C6F',
    TERTIARY: '#2D2F33',
  },
} as const;