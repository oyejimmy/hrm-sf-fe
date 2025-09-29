import React, { createContext, useContext } from 'react';
import { useCurrentUser, useLogin, useLogout, useSignup, useCompleteProfile, useProfileStatus } from '../hooks/api/useAuth';
import { User } from '../services/api/types';

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
  signup: (userData: { email: string; password: string; first_name: string; last_name: string; role: string; }) => void;
  completeProfile: (profileData: any) => void;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
  isSignupLoading: boolean;
  isCompleteProfileLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { data: profileStatus } = useProfileStatus();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();
  const completeProfileMutation = useCompleteProfile();

  const authValue: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isProfileComplete: user?.is_profile_complete || false,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    signup: signupMutation.mutate,
    completeProfile: completeProfileMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isCompleteProfileLoading: completeProfileMutation.isPending,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };