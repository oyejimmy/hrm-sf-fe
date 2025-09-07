import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { authActions } from '../../store/sagas/authSaga';
import { selectAuth, selectIsAuthenticated, selectUser, selectAuthLoading } from '../../store/selectors/authSelectors';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      console.log('Token found, fetching user data');
      dispatch(authActions.getUserRequest());
    }
  }, [dispatch, user]);
  
  // Add another effect to log when user data changes
  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.role);
    }
  }, [user]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
