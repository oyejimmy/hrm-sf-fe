import React, { createContext, useContext } from 'react';
import { useAuth, User } from '../hooks/useAuth';

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => void;
  signup: (data: { email: string; password: string; first_name: string; last_name: string; role: string }) => void;
  logout: () => void;
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  isLogoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
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