import React from 'react';
import { CommonLayout } from './CommonLayout';

export const AdminLayout: React.FC = () => {
  return <CommonLayout userRole="admin" />;
};