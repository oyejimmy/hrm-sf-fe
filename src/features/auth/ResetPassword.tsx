import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Form, Input, notification } from "antd";
import { isValidEmail } from "../../utils/security";
import {
  AuthButton,
  AuthContainer,
  AuthFooter,
  AuthFooterText,
  AuthForm,
  AuthLink,
  AuthSubtitle,
  AuthTitle,
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
  KeyOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../services/api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();
  const [shake, setShake] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Get email from URL params if available
  useEffect(() => {
    const email = searchParams.get("email");
    if (email && isValidEmail(email)) {
      setUserEmail(email);
      form.setFieldsValue({ email });
      checkTempPassword(email);
    }
  }, [searchParams, form]);

  const checkTempPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.checkTempPassword(email),
    onSuccess: (data) => {
      if (data.has_temp_password) {
        setUserName(data.user_name);
        setStep("reset");
      } else {
        notification.error({
          message: "No Temporary Password",
          description: "This user does not have a temporary password. Please contact HR.",
        });
      }
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "User not found or error checking temporary password.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.resetPassword(data),
    onSuccess: () => {
      notification.success({
        message: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now login with your new password.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      notification.error({
        message: "Reset Failed",
        description: error.response?.data?.detail || "Failed to reset password. Please try again.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
  });

  const checkTempPassword = (email: string) => {
    if (isValidEmail(email)) {
      checkTempPasswordMutation.mutate(email);
    }
  };

  const handleEmailSubmit = (values: any) => {
    if (!isValidEmail(values.email)) {
      form.setFields([
        { name: "email", errors: ["Please enter a valid email address"] },
      ]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setUserEmail(values.email);
    checkTempPassword(values.email);
  };

  const handleResetSubmit = (values: any) => {
    if (values.new_password !== values.confirm_password) {
      form.setFields([
        { name: "confirm_password", errors: ["Passwords do not match"] },
      ]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    resetPasswordMutation.mutate({
      email: userEmail,
      temp_password: values.temp_password,
      new_password: values.new_password,
      confirm_password: values.confirm_password,
    });
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
            RESET PASSWORD
          </AuthTitle>
          <AuthSubtitle theme={currentTheme}>
            {step === "email" 
              ? "Enter your email to reset your password"
              : `Reset password for ${userName}`
            }
          </AuthSubtitle>
        </HeaderContainer>

        {step === "email" ? (
          <AuthForm
            form={form}
            name="email-check"
            onFinish={handleEmailSubmit}
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

            <Form.Item>
              <AuthButton
                type="primary"
                htmlType="submit"
                loading={checkTempPasswordMutation.isPending}
                block
                theme={currentTheme}
                className="hover-lift"
              >
                Check Email
              </AuthButton>
            </Form.Item>
          </AuthForm>
        ) : (
          <AuthForm
            form={form}
            name="reset-password"
            onFinish={handleResetSubmit}
            layout="vertical"
            size="large"
            theme={currentTheme}
          >
            <FormItemContainer
              name="temp_password"
              rules={[
                { required: true, message: "Please enter your temporary password" },
              ]}
            >
              <FullWidthInputContainer theme={currentTheme}>
                <StyledInput
                  theme={currentTheme}
                  prefix={
                    <KeyOutlined
                      style={{
                        color: IconStyle.getColor(
                          currentTheme.themeMode === "dark"
                        ),
                      }}
                    />
                  }
                  placeholder="Temporary Password"
                  autoComplete="off"
                />
              </FullWidthInputContainer>
            </FormItemContainer>

            <FormItemContainer
              name="new_password"
              rules={[
                { required: true, message: "Please enter your new password" },
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
                  placeholder="New Password"
                  autoComplete="new-password"
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

            <FormItemContainer
              name="confirm_password"
              rules={[
                { required: true, message: "Please confirm your new password" },
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
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
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

            <Form.Item>
              <AuthButton
                type="primary"
                htmlType="submit"
                loading={resetPasswordMutation.isPending}
                block
                theme={currentTheme}
                className="hover-lift"
              >
                Reset Password
              </AuthButton>
            </Form.Item>
          </AuthForm>
        )}

        <AuthFooter>
          <AuthFooterText theme={currentTheme}>
            Remember your password?{" "}
          </AuthFooterText>
          <AuthLink
            to="/login"
            theme={currentTheme}
            className="hover-underline"
          >
            Back to Login
          </AuthLink>
        </AuthFooter>
      </ResponsiveGlassCard>
    </AuthContainer>
  );
};

export default ResetPassword;