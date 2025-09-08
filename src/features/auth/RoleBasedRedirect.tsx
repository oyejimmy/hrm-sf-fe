import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store';
import { getDashboardRoute, isValidSession } from '../../utils/authHelpers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, user, token, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner tip="Redirecting..." />;
  }

  if (!isAuthenticated || !isValidSession(user, token)) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <LoadingSpinner tip="Loading user data..." />;
  }

  const dashboardRoute = getDashboardRoute(user.role);
  return <Navigate to={dashboardRoute} replace />;
};

export default RoleBasedRedirect;