# HRM System Theme Guide

## Overview

The HRM System now uses a comprehensive theme system with a consistent color palette across both light and dark modes. All hard-coded colors have been replaced with theme variables to ensure consistency and maintainability.

## Color Scheme

### Primary Colors
- **Main Color**: `#2958C4` - Used for primary actions, branding, and key UI elements
- **Secondary Color**: `#C49629` - Used for secondary actions, highlights, and accents
- **Component Color**: `#3D4C6F` - Used for component backgrounds in dark mode

### Monochromatic Palette
- **Primary**: `#2958C4` - Main brand color
- **Secondary**: `#3D4C6F` - Supporting color for depth
- **Tertiary**: `#2D2F33` - Text and subtle elements

## Theme Structure

### Light Theme
```typescript
colors: {
  primary: '#2958C4',
  secondary: '#C49629',
  component: '#3D4C6F',
  monochromatic: {
    primary: '#2958C4',
    secondary: '#3D4C6F',
    tertiary: '#2D2F33',
  },
  background: '#f0f2f5',
  surface: '#ffffff',
  textPrimary: '#2D2F33',
  textSecondary: '#3D4C6F',
  // ... other colors
}
```

### Dark Theme
```typescript
colors: {
  primary: '#2958C4',
  secondary: '#C49629',
  component: '#3D4C6F',
  monochromatic: {
    primary: '#2958C4',
    secondary: '#3D4C6F',
    tertiary: '#2D2F33',
  },
  background: '#141414',
  surface: '#1f1f1f',
  textPrimary: '#ffffff',
  textSecondary: '#d9d9d9',
  // ... other colors
}
```

## Usage

### In Styled Components
```typescript
import styled from 'styled-components';

const MyComponent = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textPrimary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
`;
```

### With Theme Hook
```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div style={{ color: currentTheme.colors.primary }}>
      Content
    </div>
  );
};
```

### Using Theme Utilities
```typescript
import { getThemeColor, getStatusColor, getRoleColor } from '../utils/themeUtils';

// Get theme colors
const primaryColor = getThemeColor('primary', 'light');
const statusColor = getStatusColor('active', 'dark');
const roleColor = getRoleColor('admin', 'light');
```

## Theme Variables

### Colors
- `colors.primary` - Main brand color
- `colors.secondary` - Secondary brand color
- `colors.component` - Component-specific color
- `colors.monochromatic.primary` - Monochromatic primary
- `colors.monochromatic.secondary` - Monochromatic secondary
- `colors.monochromatic.tertiary` - Monochromatic tertiary
- `colors.success` - Success states
- `colors.warning` - Warning states
- `colors.error` - Error states
- `colors.info` - Information states
- `colors.background` - Page background
- `colors.surface` - Card/component backgrounds
- `colors.surfaceSecondary` - Secondary surfaces
- `colors.textPrimary` - Primary text color
- `colors.textSecondary` - Secondary text color
- `colors.textDisabled` - Disabled text color
- `colors.border` - Border color
- `colors.borderLight` - Light border color

### Spacing
- `spacing.xs` - 4px
- `spacing.sm` - 8px
- `spacing.md` - 16px
- `spacing.lg` - 24px
- `spacing.xl` - 32px
- `spacing.xxl` - 48px

### Border Radius
- `borderRadius.sm` - 4px
- `borderRadius.md` - 6px
- `borderRadius.lg` - 8px
- `borderRadius.xl` - 12px

### Shadows
- `shadows.sm` - Small shadow
- `shadows.md` - Medium shadow
- `shadows.lg` - Large shadow
- `shadows.xl` - Extra large shadow

### Typography
- `typography.fontFamily` - System font stack
- `typography.fontSize.*` - Font sizes (xs, sm, md, lg, xl, xxl)
- `typography.fontWeight.*` - Font weights (normal, medium, semibold, bold)
- `typography.lineHeight.*` - Line heights (tight, normal, relaxed)

### Breakpoints
- `breakpoints.xs` - 480px
- `breakpoints.sm` - 576px
- `breakpoints.md` - 768px
- `breakpoints.lg` - 992px
- `breakpoints.xl` - 1200px
- `breakpoints.xxl` - 1600px

### Z-Index
- `zIndex.dropdown` - 1000
- `zIndex.sticky` - 1020
- `zIndex.fixed` - 1030
- `zIndex.modalBackdrop` - 1040
- `zIndex.modal` - 1050
- `zIndex.popover` - 1060
- `zIndex.tooltip` - 1070

## Best Practices

### 1. Always Use Theme Variables
❌ **Don't do this:**
```typescript
const Button = styled.button`
  background-color: #2958C4;
  color: #ffffff;
`;
```

✅ **Do this:**
```typescript
const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textPrimary};
`;
```

### 2. Use Semantic Color Names
❌ **Don't do this:**
```typescript
<Tag color="#C49629">Status</Tag>
```

✅ **Do this:**
```typescript
<Tag color={currentTheme.colors.secondary}>Status</Tag>
```

### 3. Leverage Theme Utilities
```typescript
import { getStatusColor, getRoleColor } from '../utils/themeUtils';

const statusColor = getStatusColor('active', isDarkMode ? 'dark' : 'light');
const roleColor = getRoleColor('admin', isDarkMode ? 'dark' : 'light');
```

### 4. Responsive Design with Theme Breakpoints
```typescript
const ResponsiveComponent = styled.div`
  padding: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;
```

## Migration from Hard-coded Colors

### Common Replacements
- `#1890ff` → `${props => props.theme.colors.primary}`
- `#52c41a` → `${props => props.theme.colors.success}`
- `#faad14` → `${props => props.theme.colors.warning}`
- `#ff4d4f` → `${props => props.theme.colors.error}`
- `#ffffff` → `${props => props.theme.colors.surface}`
- `#f0f2f5` → `${props => props.theme.colors.background}`
- `#262626` → `${props => props.theme.colors.textPrimary}`
- `#8c8c8c` → `${props => props.theme.colors.textSecondary}`

### Gradients
Use the theme utility functions for consistent gradients:
```typescript
import { getThemeGradients } from '../utils/themeUtils';

const gradients = getThemeGradients(isDarkMode ? 'dark' : 'light');
const primaryGradient = gradients.primary; // Uses primary and secondary colors
```

## Accessibility

The theme system ensures proper contrast ratios:
- Light mode: Dark text on light backgrounds
- Dark mode: Light text on dark backgrounds
- All color combinations meet WCAG AA standards
- Status colors maintain visibility in both modes

## Components Updated

The following components have been updated to use the new theme system:
- ✅ Layout components (AdminLayout, EmployeeLayout, TeamLeadLayout)
- ✅ Header component
- ✅ Authentication components (Login, Signup)
- ✅ Common components (ThemeToggle, UserRoleTag)
- ✅ Dashboard styles
- ✅ Global styles

## Future Enhancements

- Custom theme builder for different organizations
- Additional color variants for specific use cases
- Theme persistence in localStorage
- High contrast mode for accessibility
- Print-specific theme optimizations