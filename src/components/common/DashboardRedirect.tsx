import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthContext } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../utils/authHelpers';
import { LoadingSpinner } from './LoadingSpinner';

export const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner tip="Redirecting..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check cookies for user status
  const hasTempPassword = Cookies.get('has_temp_password') === 'true';
  const isProfileComplete = Cookies.get('is_profile_complete') === 'true';

  // Priority 1: If user has temp password, redirect to change password
  if (hasTempPassword) {
    return <Navigate to="/change-password" replace />;
  }

  // Priority 2: If profile not complete, redirect to onboarding
  if (!isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Priority 3: Normal dashboard redirect
  const dashboardRoute = user.role === 'admin' ? '/admin/dashboard' : getDashboardRoute(user.role);
  return <Navigate to={dashboardRoute} replace />;
};