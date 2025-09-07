import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f0f2f5;
    color: #262626;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  /* Ant Design overrides */
  .ant-layout {
    background: #f0f2f5;
  }

  .ant-layout-sider {
    background: #001529;
  }

  .ant-menu-dark {
    background: #001529;
  }

  .ant-menu-dark .ant-menu-item-selected {
    background-color: #1890ff;
  }

  .ant-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
  }

  .ant-input {
    border-radius: 6px;
  }

  .ant-select-selector {
    border-radius: 6px;
  }

  .ant-table {
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-modal {
    border-radius: 8px;
  }

  .ant-drawer {
    border-radius: 8px 0 0 8px;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Loading states */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  /* Error states */
  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #ff4d4f;
  }

  /* Empty states */
  .empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #8c8c8c;
  }

  /* Responsive utilities */
  @media (max-width: 768px) {
    .ant-layout-sider {
      position: fixed !important;
      height: 100vh;
      z-index: 1000;
    }
    
    .ant-layout-content {
      margin-left: 0 !important;
    }
  }

  /* Print styles */
  @media print {
    .ant-layout-sider,
    .ant-layout-header,
    .ant-btn,
    .ant-pagination {
      display: none !important;
    }
    
    .ant-layout-content {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`;