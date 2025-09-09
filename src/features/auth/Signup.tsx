import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { RootState } from '../../store';
import { signup, clearError } from '../../store/slices/authSlice';
import { validateFormData, isValidEmail } from '../../utils/security';
import { useTheme } from '../../contexts/ThemeContext';

const { Title } = Typography;
const { Option } = Select;

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.component} 100%);
`;

const SignupCard = styled(Card)`
  width: 450px;
  box-shadow: ${props => props.theme.shadows.xl};
  border-radius: ${props => props.theme.borderRadius.xl};
`;

const SignupTitle = styled(Title)`
  color: ${props => props.theme.colors.primary} !important;
  margin-bottom: ${props => props.theme.spacing.sm} !important;
`;

const SignupSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SignupButton = styled(Button)`
  height: 40px;
`;

const LoginText = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: SignupFormData) => {
    if (!isValidEmail(values.email)) {
      form.setFields([
        {
          name: 'email',
          errors: ['Please enter a valid email address'],
        },
      ]);
      return;
    }

    if (values.password !== values.confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: ['Passwords do not match'],
        },
      ]);
      return;
    }

    const { confirmPassword, ...signupData } = values;
    const sanitizedData = validateFormData(signupData) as Omit<SignupFormData, 'confirmPassword'>;
    
    try {
      await dispatch(signup(sanitizedData) as any).unwrap();
      navigate('/login');
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SignupTitle level={2}>
            Create Account
          </SignupTitle>
          <SignupSubtitle>Join the HRM System</SignupSubtitle>
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
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: 'Please input your first name!' },
              { min: 2, message: 'First name must be at least 2 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              { required: true, message: 'Please input your last name!' },
              { min: 2, message: 'Last name must be at least 2 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select your role">
              <Option value="employee">Employee</Option>
              <Option value="team_lead">Team Lead</Option>
              <Option value="hr">HR</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <SignupButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
            >
              Create Account
            </SignupButton>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <LoginText>Already have an account? </LoginText>
          <LoginLink to="/login">
            Sign in here
          </LoginLink>
        </div>
      </SignupCard>
    </SignupContainer>
  );
};