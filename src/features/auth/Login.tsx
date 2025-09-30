import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { Form, Input, notification } from "antd";
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

  const handleSubmit = (values: any) => {
    if (!isValidEmail(values.email)) {
      form.setFields([
        { name: "email", errors: ["Please enter a valid email address"] },
      ]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const sanitizedData = validateFormData(values);
    login({ email: sanitizedData.email, password: sanitizedData.password });
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

          <ForgotPasswordLink to="/forgot-password" theme={currentTheme}>
            Forgot password?
          </ForgotPasswordLink>

          <Form.Item>
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
