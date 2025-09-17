import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuthContext } from '../../contexts/AuthContext';
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
  const navigate = useNavigate();
  const { isAuthenticated, user, login, isLoginLoading } = useAuthContext();
  const { currentTheme } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated && user?.redirect_url) {
      navigate(user.redirect_url);
    } else if (isAuthenticated && user?.role) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    }
  }, [isAuthenticated, user, navigate]);

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
    login(sanitizedData);
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
              loading={isLoginLoading}
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