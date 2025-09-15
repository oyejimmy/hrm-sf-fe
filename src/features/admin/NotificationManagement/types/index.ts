export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'read' | 'unread';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'hr' | 'employee_request' | 'general';
  recipientType: 'all' | 'role_based' | 'specific';
  recipients?: string[];
  createdBy: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'hr' | 'employee';
  avatar?: string;
  email: string;
}

export interface NotificationFormValues {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'hr' | 'employee_request' | 'general';
  recipientType: 'all' | 'role_based' | 'specific';
  createdAt?: any;
}