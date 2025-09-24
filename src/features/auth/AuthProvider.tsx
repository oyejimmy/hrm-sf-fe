import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import OnboardingWrapper from '../../components/onboarding/OnboardingWrapper';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  if (isLoading && !user) {
    return <LoadingSpinner tip="Initializing..." />;
  }

  if (isAuthenticated && user) {
    return (
      <OnboardingWrapper>
        {children}
      </OnboardingWrapper>
    );
  }

  return <>{children}</>;
};