export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Employee endpoints
  EMPLOYEES: {
    BASE: '/employees',
    PROFILE: (userId: string) => `/employees/profile/${userId}`,
  },
  
  // Attendance endpoints
  ATTENDANCE: {
    BASE: '/attendance',
    LOG: '/attendance/log',
    TODAY: '/attendance/today',
    USER: (userId: string) => `/attendance/user/${userId}`,
    SUMMARY: (userId: string) => `/attendance/summary/${userId}`,
  },
  
  // Leave endpoints
  LEAVE: {
    BASE: '/leave',
    REQUEST: '/leave/request',
    MY_REQUESTS: '/leave/my-requests',
    PENDING: '/leave/pending',
    APPROVE: (requestId: string) => `/leave/approve/${requestId}`,
    BALANCE: (userId: string) => `/leave/balance/${userId}`,
  },
  
  // Reports endpoints
  REPORTS: {
    BASE: '/reports',
    DASHBOARD_STATS: '/reports/dashboard-stats',
    ATTENDANCE_REPORT: '/reports/attendance-report',
    LEAVE_REPORT: '/reports/leave-report',
    EMPLOYEE_SUMMARY: (userId: string) => `/reports/employee-summary/${userId}`,
  },
  
  // Recruitment endpoints
  RECRUITMENT: {
    BASE: '/recruitment',
  },
  
  // Performance endpoints
  PERFORMANCE: {
    BASE: '/performance',
  },
  
  // Training endpoints
  TRAINING: {
    BASE: '/training',
  },
  
  // Documents endpoints
  DOCUMENTS: {
    BASE: '/documents',
  },
  
  // Notifications endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
  },
  
  // Announcements endpoints
  ANNOUNCEMENTS: {
    BASE: '/announcements',
  },
};