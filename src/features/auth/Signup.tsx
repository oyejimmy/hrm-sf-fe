import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, notification, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  SunOutlined,
  MoonOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { isValidEmail } from "../../utils/security";
import { COUNTRY_CODES } from "../../utils/constants";
import { useTheme } from "../../contexts/ThemeContext";
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
  MessageFormItem,
  FullWidthInputContainer,
  CountrySelect,
  StyledInput,
  StyledSelect,
  StyledTextArea,
  FlagSpan,
  IconStyle,
  getDropdownStyle,
} from "./styles";
import { useMutation } from "@tanstack/react-query";

const { Option } = Select;

const DEPARTMENTS = [
  { value: 'hr', label: 'Human Resources' },
  { value: 'it', label: 'Information Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' }
];

const submitAccessRequest = async (data: any) => {
  const response = await fetch("http://localhost:8000/auth/access-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
};


const Signup = () => {
  const navigate = useNavigate();
  const { currentTheme, isDarkMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();

  const [shake, setShake] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");

  const mutation = useMutation({
    mutationFn: submitAccessRequest,
    onSuccess: () => {
      notification.success({
        message: "Request Submitted Successfully",
        description:
          "Your access request has been sent to HR/Admin. You will receive an email with your company credentials once approved.",
        duration: 3,
      });
      form.resetFields();
      setCountryCode("+92");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error: Error) => {
      notification.error({
        message: "Submission Failed",
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (values: any) => {
    if (!isValidEmail(values.personal_email)) {
      form.setFields([
        {
          name: "personal_email",
          errors: ["Please enter a valid email address"],
        },
      ]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    let phoneNumber = values.phone || "";
    if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.substring(1);
    }

    const requestData = {
      full_name: values.full_name,
      personal_email: values.personal_email,
      phone: countryCode + phoneNumber,
      department: values.department,
      message: values.message || null,
    };

    mutation.mutate(requestData);
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
          <LogoImage
            src="/logo.png"
            alt="Smart Forum HRMS Logo"
            theme={currentTheme}
          />
          <AuthTitle level={2} theme={currentTheme}>
            SMART FORUM HRMS
          </AuthTitle>
          <AuthSubtitle theme={currentTheme}>
            Request access to join our organization
          </AuthSubtitle>
        </HeaderContainer>

        <AuthForm
          form={form}
          name="access-request"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          theme={currentTheme}
        >
          <FormItemContainer
            name="full_name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <FullWidthInputContainer theme={currentTheme}>
              <StyledInput
                theme={currentTheme}
                prefix={
                  <UserOutlined
                    style={{
                      color: IconStyle.getColor(
                        currentTheme.themeMode === "dark"
                      ),
                    }}
                  />
                }
                placeholder="Full Name"
              />
            </FullWidthInputContainer>
          </FormItemContainer>

          <FormItemContainer
            name="personal_email"
            rules={[
              { required: true, message: "Please enter your personal email" },
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
                placeholder="Personal Email Address"
              />
            </FullWidthInputContainer>
          </FormItemContainer>

          <FormItemContainer name="phone">
            <StyledInput
              theme={currentTheme}
              placeholder="Phone Number"
              addonBefore={
                <CountrySelect
                  theme={currentTheme}
                  value={countryCode}
                  onChange={(value: any) => setCountryCode(value)}
                  dropdownStyle={getDropdownStyle(
                    currentTheme.themeMode === "dark"
                  )}
                >
                  {COUNTRY_CODES.map((country) => (
                    <Option key={country.code} value={country.code}>
                      <FlagSpan>{country.flag}</FlagSpan>
                      {country.code}
                    </Option>
                  ))}
                </CountrySelect>
              }
            />
          </FormItemContainer>

          <FormItemContainer
            name="department"
            rules={[
              { required: true, message: "Please select your department" },
            ]}
          >
            <StyledSelect
              theme={currentTheme}
              placeholder="Select Department"
              dropdownMatchSelectWidth={false}
              dropdownStyle={getDropdownStyle(
                currentTheme.themeMode === "dark"
              )}
            >
              {DEPARTMENTS.map(dept => (
                <Option key={dept.value} value={dept.value}>
                  {dept.label}
                </Option>
              ))}
            </StyledSelect>
          </FormItemContainer>

          <MessageFormItem name="message">
            <StyledTextArea
              theme={currentTheme}
              placeholder="Additional message (optional)"
              rows={3}
            />
          </MessageFormItem>

          <Form.Item>
            <AuthButton
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              block
              theme={currentTheme}
              icon={<SendOutlined />}
            >
              Submit Access Request
            </AuthButton>
          </Form.Item>
        </AuthForm>

        <AuthFooter>
          <AuthFooterText theme={currentTheme}>
            Already have company credentials?{" "}
          </AuthFooterText>
          <AuthLink
            to="/login"
            theme={currentTheme}
            className="hover-underline"
          >
            Sign in here
          </AuthLink>
        </AuthFooter>
      </ResponsiveGlassCard>
    </AuthContainer>
  );
};

export default Signup;
