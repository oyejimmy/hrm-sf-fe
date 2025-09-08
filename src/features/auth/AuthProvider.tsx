import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentUser } from '../../store/slices/authSlice';
import { tokenStorage } from '../../utils/security';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenStorage.getToken('access_token');
      
      if (token && !user) {
        try {
          await dispatch(getCurrentUser() as any);
        } catch (error) {
          console.error('Failed to get current user:', error);
        }
      }
      
      setInitializing(false);
    };

    initializeAuth();
  }, [dispatch, user]);

  if (initializing || (isAuthenticated && isLoading && !user)) {
    return <LoadingSpinner tip="Initializing..." />;
  }

  return <>{children}</>;
};