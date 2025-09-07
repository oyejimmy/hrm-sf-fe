import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

import { RootState, AppDispatch } from '../../store';
import { authActions } from '../../store/sagas/authSaga';
import { selectAuth, selectIsAuthenticated, selectUser, selectAuthLoading, selectAuthError } from '../../store/selectors/authSelectors';

const { Title, Text } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.themeMode === 'dark' 
    ? 'linear-gradient(135deg, #1f1f1f 0%, #2d1b3d 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 20px;
  transition: background 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background: ${({ theme }) => theme.themeMode === 'dark' ? '#1f1f1f' : '#ffffff'};
  
  .ant-card-body {
    padding: 24px;
    
    @media (max-width: 768px) {
      padding: 16px;
    }
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const StyledTitle = styled(Title)`
  color: ${({ theme }) => theme.themeMode === 'dark' ? '#1890ff' : '#1890ff'} !important;
  margin-bottom: 8px !important;
  
  @media (max-width: 768px) {
    font-size: 24px !important;
  }
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.themeMode === 'dark' ? '#b3b3b3' : '#8c8c8c'};
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    height: 38px;
    font-size: 15px;
  }
`;

const LinkText = styled(Text)`
  text-align: center;
  display: block;
  margin-top: 16px;
  color: ${({ theme }) => theme.themeMode === 'dark' ? '#b3b3b3' : '#8c8c8c'};
  
  a {
    color: ${({ theme }) => theme.themeMode === 'dark' ? '#40a9ff' : '#1890ff'};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 12px;
  }
`;

export const Login: React.FC = () => {
  const { themeMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const from = location.state?.from?.pathname || '/';
      switch (user.role) {
        case 'admin':
        case 'hr':
          navigate('/admin/dashboard', { replace: true });
          console.log('Redirecting to admin dashboard');
          break;
        case 'team_lead':
          navigate('/team-lead/dashboard', { replace: true });
          console.log('Redirecting to team lead dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard', { replace: true });
          console.log('Redirecting to employee dashboard');
          break;
        default:
          navigate(from, { replace: true });
          console.log('Redirecting to default route:', from);
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(authActions.clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    dispatch(authActions.loginRequest(values));
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <StyledTitle level={2}>HRM System</StyledTitle>
          <StyledText>Sign in to your account</StyledText>
        </Logo>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Sign In
            </StyledButton>
          </Form.Item>
        </Form>

        <LinkText>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};
