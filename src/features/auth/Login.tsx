import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { RootState } from '../../store';
import { login, clearError, getCurrentUser } from '../../store/slices/authSlice';
import { validateFormData, isValidEmail } from '../../utils/security';
import { getDashboardRoute } from '../../utils/authHelpers';
import { useTheme } from '../../contexts/ThemeContext';

const { Title } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.component} 100%);
`;

const LoginCard = styled(Card)`
  width: 400px;
  box-shadow: ${props => props.theme.shadows.xl};
  border-radius: ${props => props.theme.borderRadius.xl};
`;

const LoginTitle = styled(Title)`
  color: ${props => props.theme.colors.primary} !important;
  margin-bottom: ${props => props.theme.spacing.sm} !important;
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const LoginButton = styled(Button)`
  height: 40px;
`;

const SignupText = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const SignupLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated && user?.redirect_url) {
      // Use redirect_url from API response
      navigate(user.redirect_url);
    } else if (isAuthenticated && user?.role) {
      // Fallback to role-based routing
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Fetch user data after successful login
    if (isAuthenticated && !user?.role) {
      dispatch(getCurrentUser() as any);
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: LoginFormData) => {
    if (!isValidEmail(values.email)) {
      form.setFields([
        {
          name: 'email',
          errors: ['Please enter a valid email address'],
        },
      ]);
      return;
    }

    const sanitizedData = validateFormData(values) as LoginFormData;
    dispatch(login(sanitizedData) as any);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <LoginTitle level={2}>
            HRM System
          </LoginTitle>
          <LoginSubtitle>Sign in to your account</LoginSubtitle>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(clearError())}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
            >
              Sign In
            </LoginButton>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <SignupText>Don't have an account? </SignupText>
          <SignupLink to="/signup">
            Sign up here
          </SignupLink>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};