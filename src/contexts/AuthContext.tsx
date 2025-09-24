import React, { createContext, useContext } from 'react';
import { useCurrentUser, useLogin, useLogout } from '../hooks/api/useAuth';
import { User } from '../services/api/types';

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const authValue: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
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