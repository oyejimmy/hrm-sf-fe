import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { authApi } from '../../services/api/authApi';
import UserInfoForm from './UserInfoForm';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
  const { data: profileStatus, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfileStatus,
    retry: false
  });

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show onboarding form if profile is not completed
  if (profileStatus && !profileStatus.profile_completed) {
    return <UserInfoForm />;
  }

  // Show main app if profile is completed
  return <>{children}</>;
};

export default OnboardingWrapper;