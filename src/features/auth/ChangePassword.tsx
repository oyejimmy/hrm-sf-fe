import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Form, Input, notification } from "antd";
import Cookies from "js-cookie";
import {
  AuthButton,
  AuthContainer,
  AuthForm,
  AuthTitle,
  AuthSubtitle,
  FormItemContainer,
  FullWidthInputContainer,
  IconStyle,
  ThemeToggle,
  LogoImage,
  ResponsiveGlassCard,
  HeaderContainer,
} from "./styles";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  ArrowLeftOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../services/api/authApi";
import styled from "styled-components";

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${(props: any) => props.theme.colors.primary};
  cursor: pointer;
  font-size: 14px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChangePassword = () => {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();
  const [shake, setShake] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState('');
  
  // Check if user is coming from login with temp password
  React.useEffect(() => {
    const storedEmail = Cookies.get('user_email') || '';
    const storedToken = Cookies.get('access_token') || '';
    const hasTempPassword = Cookies.get('has_temp_password') === 'true';
    
    setUserEmail(storedEmail);
    setToken(storedToken);
    setIsNewUser(hasTempPassword);
  }, []);

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: (response: any) => {
      notification.success({
        message: "Password Changed",
        description: "Your password has been changed successfully.",
      });
      form.resetFields();
      
      // Clear temp password flag and redirect
      Cookies.remove('has_temp_password');
      
      if (response.redirect_url) {
        window.location.href = response.redirect_url;
      } else {
        window.location.href = '/onboarding';
      }
    },
    onError: (error: any) => {
      notification.error({
        message: "Change Password Failed",
        description: error.response?.data?.detail || "Failed to change password. Please try again.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
  });

  const handleSubmit = (values: any) => {
    if (values.new_password !== values.confirm_password) {
      form.setFields([
        { name: "confirm_password", errors: ["Passwords do not match"] },
      ]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    changePasswordMutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
      confirm_password: values.confirm_password,
    });
  };

  return (
    <AuthContainer theme={currentTheme}>
      <ThemeToggle onClick={toggleTheme} theme={currentTheme}>
        {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      </ThemeToggle>

      {!isNewUser && (
        <BackButton theme={currentTheme} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
          Back
        </BackButton>
      )}

      <ResponsiveGlassCard
        theme={currentTheme}
        className={shake ? "shake" : ""}
      >
        <HeaderContainer>
          <LogoImage src="/logo.png" alt="Smart Forum HRMS Logo" />
          <AuthTitle level={2} theme={currentTheme}>
            {isNewUser ? "SET YOUR PASSWORD" : "CHANGE PASSWORD"}
          </AuthTitle>
          <AuthSubtitle theme={currentTheme}>
            {isNewUser 
              ? "Please set a new password to continue" 
              : "Update your account password"
            }
          </AuthSubtitle>
        </HeaderContainer>

        <AuthForm
          form={form}
          name="change-password"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          theme={currentTheme}
        >
          <FormItemContainer
            name="current_password"
            rules={[
              { required: true, message: "Please enter your current password" },
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
                placeholder="Current Password"
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
              loading={changePasswordMutation.isPending}
              block
              theme={currentTheme}
              className="hover-lift"
            >
              Change Password
            </AuthButton>
          </Form.Item>
        </AuthForm>
      </ResponsiveGlassCard>
    </AuthContainer>
  );
};

export default ChangePassword;