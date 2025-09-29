import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { api } from '../services/api/api';

const { Text, Paragraph } = Typography;

const DebugAuth: React.FC = () => {
  const [authStatus, setAuthStatus] = React.useState<any>(null);
  const [apiTest, setApiTest] = React.useState<any>(null);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    setAuthStatus({
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      token: token ? token.substring(0, 50) + '...' : null,
    });
  };

  const testAPI = async () => {
    try {
      const response = await api.get('/api/attendance/today');
      setApiTest({ success: true, data: response.data });
    } catch (error: any) {
      setApiTest({ 
        success: false, 
        error: error.response?.status || 'Network Error',
        message: error.response?.data?.detail || error.message 
      });
    }
  };

  const loginTest = async () => {
    try {
      const response = await api.post('/auth/login', {
        email: 'employee@hrm.com',
        password: 'emp123'
      });
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      setAuthStatus({ loginSuccess: true, user: response.data.user });
    } catch (error: any) {
      setAuthStatus({ 
        loginSuccess: false, 
        error: error.response?.data?.detail || error.message 
      });
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Card title="Authentication Debug" style={{ margin: 20 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button onClick={checkAuth}>Check Auth Status</Button>
        <Button onClick={loginTest} type="primary">Test Login</Button>
        <Button onClick={testAPI}>Test Attendance API</Button>
        
        {authStatus && (
          <div>
            <Text strong>Auth Status:</Text>
            <Paragraph>
              <pre>{JSON.stringify(authStatus, null, 2)}</pre>
            </Paragraph>
          </div>
        )}
        
        {apiTest && (
          <div>
            <Text strong>API Test Result:</Text>
            <Paragraph>
              <pre>{JSON.stringify(apiTest, null, 2)}</pre>
            </Paragraph>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default DebugAuth;