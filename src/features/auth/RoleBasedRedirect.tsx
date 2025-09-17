import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { getDashboardRoute, isValidSession } from '../../utils/authHelpers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { tokenStorage } from '../../utils/security';

const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const token = tokenStorage.getToken('access_token');

  if (isLoading) {
    return <LoadingSpinner tip="Redirecting..." />;
  }

  if (!isAuthenticated || !isValidSession(user || null, token)) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <LoadingSpinner tip="Loading user data..." />;
  }

  const dashboardRoute = getDashboardRoute(user.role);
  return <Navigate to={dashboardRoute} replace />;
};

export default RoleBasedRedirect;