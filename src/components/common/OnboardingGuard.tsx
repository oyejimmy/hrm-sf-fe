import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { PageLoader } from './PageLoader';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <PageLoader />;
  }

  if (user && !user.is_profile_complete && user.role === 'employee') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};