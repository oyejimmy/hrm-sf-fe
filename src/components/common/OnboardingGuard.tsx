import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
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

  // Check cookies for user status
  const hasTempPassword = Cookies.get('has_temp_password') === 'true';
  const isProfileComplete = Cookies.get('is_profile_complete') === 'true';

  // Priority 1: If user has temp password, redirect to change password
  if (hasTempPassword) {
    return <Navigate to="/change-password" replace />;
  }

  // Priority 2: If profile not complete, redirect to onboarding
  if (user && !isProfileComplete && user.role === 'employee') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};