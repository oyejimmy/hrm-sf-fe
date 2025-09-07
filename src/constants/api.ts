// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id: string) => `/employees/${id}`,
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
    PROFILE: (userId: string) => `/employees/profile/${userId}`,
    SEARCH: '/employees/search',
  },
  
  // Attendance
  ATTENDANCE: {
    LOG: '/attendance/log',
    TODAY: '/attendance/today',
    USER: (userId: string) => `/attendance/user/${userId}`,
    UPDATE: (id: string) => `/attendance/${id}`,
    SUMMARY: (userId: string) => `/attendance/summary/${userId}`,
    REPORT: '/attendance/report',
  },
  
  // Leave Management
  LEAVE: {
    REQUEST: '/leave/request',
    MY_REQUESTS: '/leave/my-requests',
    PENDING: '/leave/pending',
    APPROVE: (id: string) => `/leave/approve/${id}`,
    BALANCE: (userId: string) => `/leave/balance/${userId}`,
    TEAM_REQUESTS: '/leave/team-requests',
    REPORT: '/leave/report',
  },
  
  // Reports
  REPORTS: {
    DASHBOARD_STATS: '/reports/dashboard-stats',
    ATTENDANCE_REPORT: '/reports/attendance-report',
    LEAVE_REPORT: '/reports/leave-report',
    EMPLOYEE_SUMMARY: (userId: string) => `/reports/employee-summary/${userId}`,
    PERFORMANCE_REPORT: '/reports/performance-report',
    TRAINING_REPORT: '/reports/training-report',
  },
  
  // Recruitment
  RECRUITMENT: {
    JOBS: '/recruitment/jobs',
    CREATE_JOB: '/recruitment/jobs',
    APPLICATIONS: '/recruitment/applications',
    APPLY: '/recruitment/apply',
  },
  
  // Performance
  PERFORMANCE: {
    REVIEWS: '/performance/reviews',
    CREATE_REVIEW: '/performance/reviews',
    UPDATE_REVIEW: (id: string) => `/performance/reviews/${id}`,
    EMPLOYEE_REVIEWS: (userId: string) => `/performance/reviews/employee/${userId}`,
  },
  
  // Training
  TRAINING: {
    PROGRAMS: '/training/programs',
    CREATE_PROGRAM: '/training/programs',
    ENROLLMENTS: '/training/enrollments',
    ENROLL: '/training/enroll',
    MY_TRAININGS: '/training/my-trainings',
  },
  
  // Documents
  DOCUMENTS: {
    UPLOAD: '/documents/upload',
    MY_DOCUMENTS: '/documents/my-documents',
    ALL_DOCUMENTS: '/documents/all-documents',
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    MY_NOTIFICATIONS: '/notifications/my-notifications',
    SEND: '/notifications/send',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
  
  // Announcements
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    CREATE: '/announcements',
    UPDATE: (id: string) => `/announcements/${id}`,
    DELETE: (id: string) => `/announcements/${id}`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Request Timeouts
export const REQUEST_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};
