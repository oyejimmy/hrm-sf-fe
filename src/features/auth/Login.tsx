import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { Form, Input, message } from "antd";
import { isValidEmail, validateFormData } from "../../utils/security";
import {
  AuthButton,
  AuthContainer,
  AuthFooter,
  AuthFooterText,
  AuthForm,
  AuthLink,
  AuthSubtitle,
  AuthTitle,
  ForgotPasswordLink,
  ThemeToggle,
  LogoImage,
  ResponsiveGlassCard,
  HeaderContainer,
  FormItemContainer,
  FullWidthInputContainer,
  StyledInput,
  IconStyle,
} from "./styles";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  const { login, isLoginLoading } = useAuthContext();
  const [form] = Form.useForm();
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    if (isSubmitting || isLoginLoading) return;
    
    if (!isValidEmail(values.email)) {
      message.error('Please enter a valid email address');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    const sanitizedData = validateFormData(values);
    
    try {
      await login({ email: sanitizedData.email, password: sanitizedData.password });
    } catch (err: any) {
      let errorMessage = 'Login failed';
      
      if (err.response) {
        const status = err.response.status;
        const detail = err.response.data?.detail;
        
        switch (status) {
          case 400:
            errorMessage = 'Invalid credentials. Please check your email and password';
            break;
          case 401:
            errorMessage = 'Invalid credentials. Please check your email and password';
            break;
          case 403:
            errorMessage = 'Access denied. Your account may be disabled';
            break;
          case 404:
            errorMessage = 'User not found. Please check your email address';
            break;
          case 422:
            errorMessage = detail || 'Invalid input data';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          case 502:
            errorMessage = 'Service unavailable. Please try again later';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later';
            break;
          default:
            errorMessage = detail || `Login failed (Error ${status})`;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your internet connection';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      message.error(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContainer theme={currentTheme}>
      <ThemeToggle onClick={toggleTheme} theme={currentTheme}>
        {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      </ThemeToggle>

      <ResponsiveGlassCard
        theme={currentTheme}
        className={shake ? "shake" : ""}
      >
        <HeaderContainer>
          <LogoImage src="/logo.png" alt="Smart Forum HRMS Logo" />
          <AuthTitle level={2} theme={currentTheme}>
            SMART FORUM HRMS
          </AuthTitle>
          <AuthSubtitle theme={currentTheme}>
            Sign in to continue to your work profile account
          </AuthSubtitle>
        </HeaderContainer>

        <AuthForm
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          theme={currentTheme}
        >
          <FormItemContainer
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <FullWidthInputContainer theme={currentTheme}>
              <StyledInput
                theme={currentTheme}
                prefix={
                  <MailOutlined
                    style={{
                      color: IconStyle.getColor(
                        currentTheme.themeMode === "dark"
                      ),
                    }}
                  />
                }
                placeholder="Email Address"
                autoComplete="email"
              />
            </FullWidthInputContainer>
          </FormItemContainer>

          <FormItemContainer
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <FullWidthInputContainer theme={currentTheme}>
              <Input.Password
                prefix={
                  <LockOutlined
                    style={{
                      color: IconStyle.getColor(
                        currentTheme.themeMode === "dark"
                      ),
                    }}
                  />
                }
                placeholder="Password"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone
                      style={{
                        color: IconStyle.getColor(
                          currentTheme.themeMode === "dark"
                        ),
                      }}
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{
                        color: IconStyle.getColor(
                          currentTheme.themeMode === "dark"
                        ),
                      }}
                    />
                  )
                }
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: "12px 16px",
                  color: currentTheme.themeMode === "dark" ? "white" : "black",
                }}
              />
            </FullWidthInputContainer>
          </FormItemContainer>

          <ForgotPasswordLink to="/reset-password" theme={currentTheme}>
            Forgot password?
          </ForgotPasswordLink>

          <Form.Item>
            <AuthButton
              type="primary"
              htmlType="submit"
              loading={isSubmitting || isLoginLoading}
              disabled={isSubmitting || isLoginLoading}
              block
              theme={currentTheme}
              className="hover-lift"
            >
              Sign In
            </AuthButton>
          </Form.Item>
        </AuthForm>

        <AuthFooter>
          <AuthFooterText theme={currentTheme}>
            Don't have an account?{" "}
          </AuthFooterText>
          <AuthLink
            to="/signup"
            theme={currentTheme}
            className="hover-underline"
          >
            Sign up here
          </AuthLink>
        </AuthFooter>
      </ResponsiveGlassCard>
    </AuthContainer>
  );
};

export default Login;
