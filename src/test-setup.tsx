// Test file to verify TanStack Query setup
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './contexts/AuthContext';

const TestComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  
  return (
    <div>
      <h1>TanStack Query Setup Test</h1>
      <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      <p>User: {user ? `${user.first_name} ${user.last_name}` : 'No user'}</p>
    </div>
  );
};

export const TestApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </QueryClientProvider>
  );
};