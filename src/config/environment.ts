export const environment = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  DEBUG: process.env.REACT_APP_DEBUG === 'true',
};
