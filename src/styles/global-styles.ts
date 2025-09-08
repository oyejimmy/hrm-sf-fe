import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .ant-layout {
    min-height: 100vh;
  }

  .ant-layout-content {
    background: #fff;
  }

  .ant-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .ant-btn {
    border-radius: 6px;
  }

  .ant-input {
    border-radius: 6px;
  }

  .ant-select .ant-select-selector {
    border-radius: 6px;
  }

  .ant-form-item-label > label {
    font-weight: 500;
  }

  .ant-statistic-title {
    font-weight: 500;
    color: #666;
  }

  .ant-statistic-content {
    font-weight: 600;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
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
    color: #ff4d4f;
    padding: 20px;
  }

  /* Success message */
  .success-message {
    text-align: center;
    color: #52c41a;
    padding: 20px;
  }
`;