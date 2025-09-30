import { Button, Card, Form, Typography, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

const { TextArea } = Input;

const { Title, Text } = Typography;

// Shake animation for error state
const shake = keyframes`
  0%, 100% { transform: translateX(0) scale(1); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px) scale(1.02); }
  20%, 40%, 60%, 80% { transform: translateX(8px) scale(1.02); }
`;
 


export const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95); 
    filter: blur(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
    filter: blur(0);
  }
`;

// Add these styles to your existing GlassCard component
export const GlassCard = styled(Card)<{ theme: any }>`
  max-width: 440px;
  width: 100%;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  background: ${(props: any) => props.theme.themeMode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${(props: any) => props.theme.themeMode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${(props: any) => props.theme.themeMode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  animation: ${fadeIn} 0.8s ease-out;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  &.shake {
    animation: ${shake} 0.5s ease-in-out;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props: any) => props.theme.themeMode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)'};
  }
  
  .ant-card-body {
    padding: 40px;
    
    @media (max-width: 576px) {
      padding: 28px;
    }
  }
`;

// Add hover effects to existing components
export const AuthButton = styled(Button)<{ theme: any }>`
  height: 48px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const AuthLink = styled(Link)<{ theme: any }>`
  color: ${(props: any) => props.theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${(props: any) => props.theme.colors.primary}, ${(props: any) => props.theme.colors.secondary});
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${(props: any) => props.theme.colors.secondary};
    
    &::after {
      width: 100%;
    }
  }
  
  &.hover-underline:hover {
    transform: translateY(-1px);
  }
`;

export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;



export const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
  50% { transform: scale(1.05); box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25); }
  100% { transform: scale(1); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const ThemeToggle = styled.button<{ theme: any }>`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${(props: any) => props.theme.themeMode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(10px);
  color: ${(props: any) => props.theme.themeMode === 'dark' ? 'white' : '#333'};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${(props: any) => props.theme.themeMode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)'};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 576px) {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const AuthContainer = styled.div<{ theme: any }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${(props: any) => props.theme.themeMode === 'dark' 
    ? 'linear-gradient(-45deg, #0f0f23, #1a1a2e, #16213e, #0f3460)'
    : '#ffffff'};
  background-size: 400% 400%;
  animation: ${(props: any) => props.theme.themeMode === 'dark' ? css`${gradientShift} 15s ease infinite` : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props: any) => props.theme.themeMode === 'dark'
      ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(41, 88, 196, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(196, 150, 41, 0.03) 0%, transparent 50%)'};
    pointer-events: none;
  }
  
  @media (max-width: 576px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 2rem;
  }
`;





export const AuthTitle = styled(Title) <{ theme: any }>`
  color: ${(props: any) => props.theme.colors.primary} !important;
  margin-bottom: 16px !important;
  font-weight: 600 !important;
  font-size: 24px !important;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: ${(props: any) => props.theme.themeMode === 'dark'
    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
    : 'none'};
`;

export const AuthSubtitle = styled(Text)<{ theme?: any }>`
  color: ${(props: any) => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  text-align: center;
  display: block;
  margin-bottom: 32px;
  font-size: 14px;
  font-weight: 400;
  text-shadow: ${(props: any) => props.theme?.themeMode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

export const LogoImage = styled.img`
  width: 120px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 12px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const AuthForm = styled(Form) <{ theme: any }>`
  .ant-form-item {
    margin-bottom: 20px;
    
    &:last-of-type {
      margin-bottom: 0;
    }
    
    .ant-form-item-label {
      label {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        font-size: 14px;
        &::before {
          display: none !important;
        }
      }
    }
    .ant-input-affix-wrapper {
      border-radius: 8px;
      padding: 12px 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      
      &:hover, &:focus, &.ant-input-affix-wrapper-focused {
        border-color: ${(props: any) => props.theme.colors.primary};
        background: rgba(255, 255, 255, 0.15);
      }
      .ant-input-prefix {
        margin-right: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
      }
      input {
        color: ${(props: any) => props.theme.themeMode === 'dark' ? 'white' : 'black'};
        background: transparent;
        font-size: 15px;
        &::placeholder {
          color: ${(props: any) => props.theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
        }
      }
    }
  }
`;

export const AuthFooter = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

export const AuthFooterText = styled(Text)<{ theme?: any }>`
  color: ${(props: any) => props.theme?.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'black'};
  font-size: 14px;
  font-weight: 400;
`;

export const ForgotPasswordLink = styled(Link) <{ theme: any }>`
  display: block;
  text-align: right;
  margin-top: 8px;
  margin-bottom: 24px;
  color: ${(props: any) => props.theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${(props: any) => props.theme.colors.secondary};
    text-decoration: underline;
  }
`;





export const ResponsiveGlassCard = styled(GlassCard)`
  width: ${window.innerWidth < 768 ? '95%' : '500px'};
  max-width: 500px;
  margin: 0 auto;
`;

export const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const FormItemContainer = styled(Form.Item)`
  margin-bottom: 20px;
`;

export const MessageFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

export const InputContainer = styled.div<{ theme: any }>`
  position: relative;
  background: ${(props: any) => props.theme.themeMode === 'dark' 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${(props: any) => props.theme.themeMode === 'dark' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 10px;
  transition: all 0.3s;
  
  &:hover {
    border-color: ${(props: any) => props.theme.colors.primary};
    background: ${(props: any) => props.theme.themeMode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(0, 0, 0, 0.04)'};
  }
  
  &:focus-within {
    border-color: ${(props: any) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props: any) => props.theme.colors.primary}30;
    background: ${(props: any) => props.theme.themeMode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(0, 0, 0, 0.04)'};
  }
  
  .ant-input-affix-wrapper {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .ant-input-prefix {
    margin-right: 10px;
  }
`;

export const FullWidthInputContainer = styled(InputContainer)`
  width: 100%;
`;

export const PhoneInputContainer = styled(InputContainer)`
  width: 100%;
  padding: 0;
  height: 48px;
  display: flex;
  align-items: center;
`;



export const CountrySelect = styled(Select)`
  width: 100px;
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
`;



export const StyledInput = styled(Input)`
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
`;

export const PhoneInput = styled(Input)`
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 12px 16px;
  height: 48px !important;
  border-radius: 0;
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  height: 48px;
  background: ${props => props.theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
`;

export const StyledTextArea = styled(TextArea)`
  width: 100%;
  background: ${props => props.theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
`;

export const FlagSpan = styled.span`
  margin-right: 8px;
`;

export const IconStyle = {
  getColor: (isDark: boolean) => isDark ? 'rgba(255, 255, 255, 0.6)' : 'black'
};

export const getDropdownStyle = (isDark: boolean) => ({
  background: isDark ? 'rgba(31, 31, 31, 0.95)' : 'white',
  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
  borderRadius: '8px',
  backdropFilter: 'blur(10px)'
});
export const StyledPasswordInput = styled(Input.Password)<{ theme: any }>`
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 12px 16px;
  color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
  
  .ant-input {
    background: transparent !important;
    color: ${props => props.theme.themeMode === 'dark' ? 'white' : 'black'};
  }
`;