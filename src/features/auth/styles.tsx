import { Button, Card, Form, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const { Title, Text } = Typography;

// Shake animation for error state
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

export const FloatingLabel = styled.label<{ isFocused: boolean; hasValue: any }>`
  position: absolute;
  left: 44px;
  top: ${(props: any) => (props.isFocused || props.hasValue) ? '4px' : '50%'};
  transform: ${(props: any) => (props.isFocused || props.hasValue) ? 'translateY(0)' : 'translateY(-50%)'};
  font-size: ${(props: any) => (props.isFocused || props.hasValue) ? '12px' : '14px'};
  color: ${(props: any) => (props.isFocused) ? 
    (props.theme.colors.primary) : 
    'rgba(255, 255, 255, 0.6)'};
  pointer-events: none;
  transition: all 0.2s ease;
  background: ${(props: any) => (props.isFocused || props.hasValue) ? 
    'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.08) 50%)' : 
    'transparent'};
  padding: 0 4px;
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Add these styles to your existing GlassCard component
export const GlassCard = styled(Card)<{ theme: any }>`
  max-width: 440px;
  width: 100%;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  transition: transform 0.3s ease;
  
  &.shake {
    animation: ${shake} 0.5s ease-in-out;
  }
  
  .ant-card-body {
    padding: 32px;
    
    @media (max-width: 576px) {
      padding: 24px;
    }
  }
`;

// Add hover effects to existing components
export const AuthButton = styled(Button)<{ theme: any }>`
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, ${(props: any) => props.theme.colors.primary} 0%, ${(props: any) => props.theme.colors.secondary} 100%);
  border: none;
  margin-top: 8px;
  transition: all 0.3s;
  
  &:hover, &:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, ${(props: any) => props.theme.colors.secondary} 0%, ${(props: any) => props.theme.colors.primary} 100%);
  }
  
  &.hover-lift:hover {
    transform: translateY(-3px);
  }
`;

export const AuthLink = styled(Link)<{ theme: any }>`
  color: ${(props: any) => props.theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${(props: any) => props.theme.colors.secondary};
  }
  
  &.hover-underline:hover {
    text-decoration: underline;
    transform: translateY(-1px);
  }
`;

export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;



export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  position: relative;
  overflow: hidden;
  @media (max-width: 576px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

export const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Particle = styled.div<{ size: number; left: number; delay: number; duration: number }>`
  position: absolute;
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  left: ${(props: any) => props.left}%;
  top: 110%;
  animation: ${float} ${(props: any) => props.duration}s ease-in-out infinite;
  animation-delay: ${(props: any) => props.delay}s;
`;

export const LogoContainer = styled.div<{ theme: any }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props: any) => props.theme.colors.primary} 0%, ${(props: any) => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  animation: ${pulse} 2s infinite ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  svg {
    font-size: 28px;
    color: white;
  }
`;

export const AuthTitle = styled(Title) <{ theme: any }>`
  color: white !important;
  margin-bottom: 8px !important;
  font-weight: 700 !important;
  text-align: center;
`;

export const AuthSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  display: block;
  margin-bottom: 24px;
  font-size: 15px;
`;

export const AuthForm = styled(Form) <{ theme: any }>`
  .ant-form-item {
    margin-bottom: 18px;
    .ant-form-item-label {
      label {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        font-size: 14px;
        &::before {
          display: none !important;
        }
      }
    }
    .ant-input-affix-wrapper {
      border-radius: 10px;
      padding: 10px 14px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
      color: white;
      transition: all 0.3s;
      &:hover, &:focus, &.ant-input-affix-wrapper-focused {
        border-color: ${(props: any) => props.theme.colors.primary};
        box-shadow: 0 0 0 2px ${(props: any) => props.theme.colors.primary}30;
        background: rgba(255, 255, 255, 0.12);
      }
      .ant-input-prefix {
        margin-right: 10px;
        color: rgba(255, 255, 255, 0.6);
      }
      input {
        color: white;
        background: transparent;
        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
`;

export const AuthFooter = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const AuthFooterText = styled(Text)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

export const ForgotPasswordLink = styled(Link) <{ theme: any }>`
  display: block;
  text-align: right;
  margin-top: -12px;
  margin-bottom: 18px;
  color: ${(props: any) => props.theme.colors.primary};
  font-size: 13px;
  &:hover {
    color: ${(props: any) => props.theme.colors.secondary};
  }
`;

export const PasswordStrengthBar = styled.div<{ strength: number; theme: any }>`
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
  
  .strength-fill {
    position: absolute;
    height: 100%;
    width: ${(props: any) => props.strength}%;
    background: ${(props: any) => {
      if (props.strength < 40) return props.theme.colors.error;
      if (props.strength < 70) return props.theme.colors.warning;
      return props.theme.colors.success;
    }};
    transition: all 0.3s ease;
  }
  
  .strength-text {
    position: absolute;
    right: 0;
    top: -20px;
    font-size: 11px;
    color: ${(props: any) => {
      if (props.strength < 40) return props.theme.colors.error;
      if (props.strength < 70) return props.theme.colors.warning;
      return props.theme.colors.success;
    }};
    font-weight: 600;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: all 0.3s;
  
  &:hover {
    border-color: ${(props: any) => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.12);
  }
  
  &:focus-within {
    border-color: ${(props: any) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props: any) => props.theme.colors.primary}30;
    background: rgba(255, 255, 255, 0.12);
    
    ${FloatingLabel} {
      color: ${(props: any) => props.theme.colors.primary};
    }
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