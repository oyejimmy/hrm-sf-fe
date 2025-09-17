import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { validateFormData, isValidEmail } from '../../utils/security';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  AuthButton, AuthContainer, AuthFooter, AuthFooterText, 
  AuthForm, AuthLink, AuthSubtitle, AuthTitle, GlassCard, 
  LogoContainer, FloatingLabel, InputContainer, PasswordStrengthBar 
} from "./styles";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isSignupLoading } = useAuthContext();
  const { currentTheme } = useTheme();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isFocused, setIsFocused] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [shake, setShake] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!isValidEmail(values.email)) {
      form.setFields([{ name: 'email', errors: ['Please enter a valid email address'] }]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (values.password !== values.confirmPassword) {
      form.setFields([{ name: 'confirmPassword', errors: ['Passwords do not match'] }]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const { confirmPassword, ...rest } = values;
    const signupData = {
      ...rest,
      role: 'employee',
    };

    try {
      const sanitizedData: any = validateFormData(signupData);
      signup(sanitizedData);
      
      notification.success({
        message: 'Account Created',
        description: 'Your account has been created successfully! Redirecting to login...',
        placement: 'topRight',
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      notification.error({
        message: 'Signup Failed',
        description: 'There was an issue creating your account. Please try again.',
        placement: 'topRight',
      });
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string, value: string) => {
    if (!value) {
      setIsFocused(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <AuthContainer>
      <GlassCard theme={currentTheme} className={shake ? 'shake' : ''}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <LogoContainer theme={currentTheme}>
            <UserOutlined />
          </LogoContainer>
          <AuthTitle level={2} theme={currentTheme}>
            Join Our Community
          </AuthTitle>
          <AuthSubtitle>Create your account to get started</AuthSubtitle>
        </div>

        <AuthForm
          form={form}
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          theme={currentTheme}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 20 }}>
            <Form.Item
              name="first_name"
              rules={[
                { required: true, message: '' },
                { min: 2, message: '' },
              ]}
            >
              <InputContainer>
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                  placeholder=""
                  autoComplete="given-name"
                  onFocus={() => handleFocus('first_name')}
                  onBlur={(e) => handleBlur('first_name', e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    boxShadow: 'none',
                    padding: '12px 16px',
                    color: 'white'
                  }}
                />
                <FloatingLabel isFocused={isFocused.first_name} hasValue={form.getFieldValue('first_name')}>
                  First Name
                </FloatingLabel>
              </InputContainer>
            </Form.Item>

            <Form.Item
              name="last_name"
              rules={[
                { required: true, message: '' },
                { min: 2, message: '' },
              ]}
            >
              <InputContainer>
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                  placeholder=""
                  autoComplete="family-name"
                  onFocus={() => handleFocus('last_name')}
                  onBlur={(e) => handleBlur('last_name', e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    boxShadow: 'none',
                    padding: '12px 16px',
                    color: 'white'
                  }}
                />
                <FloatingLabel isFocused={isFocused.last_name} hasValue={form.getFieldValue('last_name')}>
                  Last Name
                </FloatingLabel>
              </InputContainer>
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '' },
              { type: 'email', message: '' },
            ]}
            style={{ marginBottom: 20 }}
          >
            <InputContainer>
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                placeholder=""
                autoComplete="email"
                onFocus={() => handleFocus('email')}
                onBlur={(e) => handleBlur('email', e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  boxShadow: 'none',
                  padding: '12px 16px',
                  color: 'white'
                }}
              />
              <FloatingLabel isFocused={isFocused.email} hasValue={form.getFieldValue('email')}>
                Email Address
              </FloatingLabel>
            </InputContainer>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '' },
              { min: 8, message: '' },
            ]}
            style={{ marginBottom: 10 }}
          >
            <InputContainer>
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                placeholder=""
                autoComplete="new-password"
                iconRender={(visible) => (visible ? 
                  <EyeTwoTone style={{ color: 'rgba(255, 255, 255, 0.6)' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                )}
                onFocus={() => handleFocus('password')}
                onBlur={(e) => handleBlur('password', e.target.value)}
                onChange={(e) => checkPasswordStrength(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  boxShadow: 'none',
                  padding: '12px 16px',
                  color: 'white'
                }}
              />
              <FloatingLabel isFocused={isFocused.password} hasValue={form.getFieldValue('password')}>
                Password
              </FloatingLabel>
              <PasswordStrengthBar strength={passwordStrength} theme={currentTheme}>
                <div className="strength-fill" />
                <span className="strength-text">
                  {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                </span>
              </PasswordStrengthBar>
            </InputContainer>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(''));
                },
              }),
            ]}
            style={{ marginBottom: 20 }}
          >
            <InputContainer>
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                placeholder=""
                autoComplete="new-password"
                iconRender={(visible) => (visible ? 
                  <EyeTwoTone style={{ color: 'rgba(255, 255, 255, 0.6)' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                )}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  boxShadow: 'none',
                  padding: '12px 16px',
                  color: 'white'
                }}
              />
              <FloatingLabel isFocused={isFocused.confirmPassword} hasValue={form.getFieldValue('confirmPassword')}>
                Confirm Password
              </FloatingLabel>
            </InputContainer>
          </Form.Item>

          <Form.Item>
            <AuthButton
              type="primary"
              htmlType="submit"
              loading={isSignupLoading}
              block
              theme={currentTheme}
              className="hover-lift"
            >
              Create Account
            </AuthButton>
          </Form.Item>
        </AuthForm>

        <AuthFooter>
          <AuthFooterText>Already have an account? </AuthFooterText>
          <AuthLink to="/login" theme={currentTheme} className="hover-underline">
            Sign in here
          </AuthLink>
        </AuthFooter>
      </GlassCard>
    </AuthContainer>
  );
};

export default Signup;