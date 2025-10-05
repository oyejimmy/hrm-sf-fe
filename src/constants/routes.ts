// Application Routes
export const ROUTES = {
  // Public Routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    EMPLOYEES: '/admin/employees',
    ATTENDANCE_LEAVE: '/admin/attendance-leave',
    REPORTS: '/admin/reports',
    RECRUITMENT: '/admin/recruitment',
    PERFORMANCE: '/admin/performance',
    TRAINING: '/admin/training',
    DOCUMENTS: '/admin/documents',
    COMMUNICATION: '/admin/communication',
    NOTIFICATIONS: '/admin/notifications',
    PROFILE: '/admin/profile',
  },
  
  // Employee Routes
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    ATTENDANCE: '/employee/attendance',
    LEAVE: '/employee/leave',
    TRAINING: '/employee/training',
    PAYSLIP: '/employee/payslip',
    ASSETS: '/employee/assets',
    DOCUMENTS: '/employee/documents',
    COMPLAIN: '/employee/complain',
    REQUEST: '/employee/request',
    PROFILE: '/employee/profile',
  },
  
  // Team Lead Routes
  TEAM_LEAD: {
    DASHBOARD: '/team-lead/dashboard',
    ATTENDANCE: '/team-lead/attendance',
    LEAVE_REQUESTS: '/team-lead/leave-requests',
    PERFORMANCE: '/team-lead/performance',
    TRAINING: '/team-lead/training',
    PROFILE: '/team-lead/profile',
  },
  
  // Common Routes
  PROFILE: '/profile',
  EDITPROFILE: '/profile/edit',
  HOME: '/',
};

// Route Permissions
export const ROUTE_PERMISSIONS = {
  [ROUTES.ADMIN.DASHBOARD]: ['admin', 'hr'],
  [ROUTES.ADMIN.EMPLOYEES]: ['admin', 'hr'],
  [ROUTES.ADMIN.ATTENDANCE_LEAVE]: ['admin', 'hr'],
  [ROUTES.ADMIN.REPORTS]: ['admin', 'hr'],
  [ROUTES.ADMIN.RECRUITMENT]: ['admin', 'hr'],
  [ROUTES.ADMIN.PERFORMANCE]: ['admin', 'hr'],
  [ROUTES.ADMIN.TRAINING]: ['admin', 'hr'],
  [ROUTES.ADMIN.DOCUMENTS]: ['admin', 'hr'],
  [ROUTES.ADMIN.COMMUNICATION]: ['admin', 'hr'],
  [ROUTES.ADMIN.PROFILE]: ['admin', 'hr'],
  
  [ROUTES.EMPLOYEE.DASHBOARD]: ['employee'],
  [ROUTES.EMPLOYEE.ATTENDANCE]: ['employee'],
  [ROUTES.EMPLOYEE.LEAVE]: ['employee'],
  [ROUTES.EMPLOYEE.TRAINING]: ['employee'],
  [ROUTES.EMPLOYEE.PAYSLIP]: ['employee'],
  [ROUTES.EMPLOYEE.ASSETS]: ['employee'],
  [ROUTES.EMPLOYEE.DOCUMENTS]: ['employee'],
  [ROUTES.EMPLOYEE.COMPLAIN]: ['employee'],
  [ROUTES.EMPLOYEE.REQUEST]: ['employee'],
  [ROUTES.EMPLOYEE.PROFILE]: ['employee'],
  
  [ROUTES.TEAM_LEAD.DASHBOARD]: ['team_lead'],
  [ROUTES.TEAM_LEAD.ATTENDANCE]: ['team_lead'],
  [ROUTES.TEAM_LEAD.LEAVE_REQUESTS]: ['team_lead'],
  [ROUTES.TEAM_LEAD.PERFORMANCE]: ['team_lead'],
  [ROUTES.TEAM_LEAD.TRAINING]: ['team_lead'],
  [ROUTES.TEAM_LEAD.PROFILE]: ['team_lead'],
  
  [ROUTES.PROFILE]: ['admin', 'hr', 'team_lead', 'employee'],
  [ROUTES.EDITPROFILE]: ['admin', 'hr', 'team_lead', 'employee'],
};
