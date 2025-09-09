import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .ant-layout {
    min-height: 100vh;
  }

  .ant-layout-content {
    background: ${props => props.theme.colors.surface};
  }

  .ant-card {
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: ${props => props.theme.shadows.md};
  }

  .ant-btn {
    border-radius: ${props => props.theme.borderRadius.md};
  }

  .ant-input {
    border-radius: ${props => props.theme.borderRadius.md};
  }

  .ant-select .ant-select-selector {
    border-radius: ${props => props.theme.borderRadius.md};
  }

  .ant-form-item-label > label {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.textPrimary};
  }

  .ant-statistic-title {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.textSecondary};
  }

  .ant-statistic-content {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.textPrimary};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surfaceSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }

  /* Loading spinner */
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  /* Error message */
  .error-message {
    text-align: center;
    color: ${props => props.theme.colors.error};
    padding: ${props => props.theme.spacing.lg};
  }

  /* Success message */
  .success-message {
    text-align: center;
    color: ${props => props.theme.colors.success};
    padding: ${props => props.theme.spacing.lg};
  }
`;