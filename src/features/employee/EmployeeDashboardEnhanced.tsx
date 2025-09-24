import React from 'react';
import { DashboardWrapper } from '../../components/common/DashboardWrapper';
import EmployeeDashboard from './EmployeeDashboard/index';

interface DashboardProps {
  dashboardData?: any;
  loading?: boolean;
  error?: any;
}

const EmployeeDashboardComponent: React.FC<DashboardProps> = ({ dashboardData, loading, error }) => {
  return <EmployeeDashboard />;
};

export const EmployeeDashboardEnhanced: React.FC = () => {
  return (
    <DashboardWrapper>
      {(data, loading, error) => (
        <EmployeeDashboardComponent dashboardData={data} loading={loading} error={error} />
      )}
    </DashboardWrapper>
  );
};