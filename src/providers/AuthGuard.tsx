import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getDashboardRoute } from '../utils/authHelpers';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false,
  allowedRoles = []
}) => {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    
    // Redirect authenticated users away from auth pages
    if (isAuthenticated && user && isAuthPage) {
      const targetRoute = user.redirect_url || getDashboardRoute(user.role);
      navigate(targetRoute, { replace: true });
      return;
    }

    // Handle routing based on backend redirect_url
    if (requireAuth && isAuthenticated && user && user.redirect_url) {
      if (user.redirect_url === '/onboarding' && location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
        return;
      }
      if (user.redirect_url !== '/onboarding' && location.pathname === '/onboarding') {
        navigate(user.redirect_url, { replace: true });
        return;
      }
    }

    // Redirect unauthenticated users to login
    if (requireAuth && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    // Check role-based access
    if (requireAuth && isAuthenticated && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        navigate('/unauthorized', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, location.pathname, navigate, requireAuth, allowedRoles]);

  if (isLoading) {
    return <LoadingSpinner tip="Verifying authentication..." />;
  }

  return <>{children}</>;
};