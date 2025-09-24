import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { Form, Input } from "antd";
import { isValidEmail, validateFormData } from "../../utils/security";
import { 
  AuthButton, AuthContainer, AuthFooter, AuthFooterText, 
  AuthForm, AuthLink, AuthSubtitle, AuthTitle, ForgotPasswordLink, 
  GlassCard, LogoContainer, FloatingLabel, InputContainer 
} from "./styles";
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

const Login = () => {
  const { login, isLoginLoading } = useAuthContext();
  const { currentTheme } = useTheme();
  const [form] = Form.useForm();
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [shake, setShake] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!isValidEmail(values.email)) {
      form.setFields([{ name: 'email', errors: ['Please enter a valid email address'] }]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    const sanitizedData: any = validateFormData(values);
    login(sanitizedData);
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
            Welcome Back
          </AuthTitle>
          <AuthSubtitle>Sign in to continue to your account</AuthSubtitle>
        </div>

        <AuthForm
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          theme={currentTheme}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '' },
              { type: 'email', message: '' },
            ]}
            style={{ marginBottom: 30 }}
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
              { min: 6, message: '' },
            ]}
            style={{ marginBottom: 10 }}
          >
            <InputContainer>
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                placeholder=""
                autoComplete="current-password"
                iconRender={(visible) => (visible ? 
                  <EyeTwoTone style={{ color: 'rgba(255, 255, 255, 0.6)' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                )}
                onFocus={() => handleFocus('password')}
                onBlur={(e) => handleBlur('password', e.target.value)}
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
            </InputContainer>
          </Form.Item>

          <ForgotPasswordLink to="/forgot-password" theme={currentTheme}>
            Forgot password?
          </ForgotPasswordLink>

          <Form.Item style={{ marginTop: 20 }}>
            <AuthButton
              type="primary"
              htmlType="submit"
              loading={isLoginLoading}
              block
              theme={currentTheme}
              className="hover-lift"
            >
              Sign In
            </AuthButton>
          </Form.Item>
        </AuthForm>

        <AuthFooter>
          <AuthFooterText>Don't have an account? </AuthFooterText>
          <AuthLink to="/signup" theme={currentTheme} className="hover-underline">
            Sign up here
          </AuthLink>
        </AuthFooter>
      </GlassCard>
    </AuthContainer>
  );
}

export default Login;