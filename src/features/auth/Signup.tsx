import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Select, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

import { RootState, AppDispatch } from '../../store';
import { authActions } from '../../store/sagas/authSaga';
import { selectAuthLoading, selectAuthError } from '../../store/selectors/authSelectors';
import { UserRole, UserStatus } from '../../constants/enums';

const { Title, Text } = Typography;
const { Option } = Select;

const SignupContainer = styled.div`
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

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 450px;
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

export const Signup: React.FC = () => {
  const { themeMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [form] = Form.useForm();
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(authActions.clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    role: UserRole;
  }) => {
    // Remove confirm_password as it's not needed in the API call
    const { confirm_password, ...userData } = values;
    
    // Add default status
    const signupData = {
      ...userData,
      status: UserStatus.ACTIVE
    };
    
    try {
      dispatch(authActions.signupRequest(signupData));
      setSignupSuccess(true);
      form.resetFields();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <Logo>
          <StyledTitle level={2}>HRM System</StyledTitle>
          <StyledText>Create your account</StyledText>
        </Logo>

        {error && (
          <Alert
            message="Signup Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {signupSuccess && (
          <Alert
            message="Signup Successful"
            description="Your account has been created successfully. Redirecting to login..."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          name="signup"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Space direction="horizontal" size={16} style={{ display: 'flex' }}>
            <Form.Item
              name="first_name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="First Name"
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Last Name"
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select Role">
              <Option value={UserRole.ADMIN}>Admin</Option>
              <Option value={UserRole.HR}>HR</Option>
              <Option value={UserRole.TEAM_LEAD}>Team Lead</Option>
              <Option value={UserRole.EMPLOYEE}>Employee</Option>
            </Select>
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
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<UserAddOutlined />}
            >
              Sign Up
            </StyledButton>
          </Form.Item>
        </Form>

        <LinkText>
          Already have an account? <Link to="/login">Sign in</Link>
        </LinkText>
      </SignupCard>
    </SignupContainer>
  );
};
