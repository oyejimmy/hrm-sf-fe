import React from 'react';
import { Spin, Alert } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api/api';
import Profile from './Profile';

export const EnhancedProfile: React.FC = () => {
  const { user, isLoading: userLoading } = useAuthContext();
  
  // Fetch formatted profile data
  const { data: profileData, isLoading: profileLoading, error } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: () => api.get('/api/employees/me/profile').then(res => res.data),
    enabled: !!user,
  });

  if (userLoading || profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Profile"
        description="Unable to load profile data. Please try again later."
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  return <Profile userData={user} profileData={profileData} />;
};