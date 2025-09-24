import React from 'react';
import { Spin, Alert } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/api/useDashboardData';

interface DashboardWrapperProps {
  children: (data: any, loading: boolean, error: any) => React.ReactNode;
}

export const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useDashboardData();

  // Don't show dashboard for admin users - they use admin layout
  if (user?.role === 'admin') {
    return <>{children(data, isLoading, error)}</>;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description="Unable to load dashboard data. Please try again later."
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  return <>{children(data, isLoading, error)}</>;
};