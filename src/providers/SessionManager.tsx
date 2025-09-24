import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/security';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = tokenStorage.getToken('access_token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          tokenStorage.removeToken('access_token');
          tokenStorage.removeToken('refresh_token');
          queryClient.clear();
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Token validation error:', error);
        tokenStorage.removeToken('access_token');
        tokenStorage.removeToken('refresh_token');
        queryClient.clear();
        navigate('/login', { replace: true });
      }
    };

    // Check immediately
    checkTokenExpiry();
    
    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient, navigate]);

  return <>{children}</>;
};