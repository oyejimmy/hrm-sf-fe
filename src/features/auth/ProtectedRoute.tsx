import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { canAccessRoute, isValidSession } from '../../utils/authHelpers';
import { tokenStorage } from '../../utils/security';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const UnauthorizedPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary" onClick={() => window.history.back()}>
        Go Back
      </Button>
    }
  />
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const location = useLocation();
  const token = tokenStorage.getToken('access_token');

  if (isLoading) {
    return <LoadingSpinner tip="Verifying access..." />;
  }

  if (!isAuthenticated || !isValidSession(user || null, token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessRoute(user || null, allowedRoles)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};