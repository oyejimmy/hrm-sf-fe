import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../utils/authHelpers';
import { LoadingSpinner } from './LoadingSpinner';

export const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner tip="Redirecting to dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const dashboardRoute = getDashboardRoute(user.role);
  return <Navigate to={dashboardRoute} replace />;
};