import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { RootState } from '../../store';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { canAccessRoute, isValidSession } from '../../utils/authHelpers';

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
  const { isAuthenticated, user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner tip="Verifying access..." />;
  }

  if (!isAuthenticated || !isValidSession(user, token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessRoute(user, allowedRoles)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};