// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile/me',
  },

  // Employees
  EMPLOYEES: {
    BASE: '/api/employees',
    ME: '/api/employees/me',
    BY_ID: (id: string) => `/api/employees/${id}`,
  },

  // Leaves
  LEAVES: {
    BASE: '/api/leaves',
    MY_LEAVES: '/api/leaves/my-leaves',
    BALANCE: '/api/leaves/balance',
    APPROVE: (id: string) => `/api/leaves/${id}/approve`,
    REJECT: (id: string) => `/api/leaves/${id}/reject`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: '/api/attendance',
    MY_ATTENDANCE: '/api/attendance/my-attendance',
    TODAY: '/api/attendance/today',
    CHECK_IN: '/api/attendance/check-in',
    CHECK_OUT: '/api/attendance/check-out',
  },

  // Assets
  ASSETS: {
    BASE: '/api/assets',
    BY_ID: (id: string) => `/api/assets/${id}`,
    REQUESTS: '/api/assets/requests',
    APPROVE_REQUEST: (id: string) => `/api/assets/requests/${id}/approve`,
    REJECT_REQUEST: (id: string) => `/api/assets/requests/${id}/reject`,
  },

  // Complaints
  COMPLAINTS: {
    BASE: '/api/complaints',
    BY_ID: (id: string) => `/api/complaints/${id}`,
    COMMENTS: (id: string) => `/api/complaints/${id}/comments`,
    ASSIGN: (id: string) => `/api/complaints/${id}/assign`,
    RESOLVE: (id: string) => `/api/complaints/${id}/resolve`,
  },

  // Documents
  DOCUMENTS: {
    BASE: '/api/documents',
    BY_ID: (id: string) => `/api/documents/${id}`,
    UPLOAD: '/api/documents/upload',
    APPROVE: (id: string) => `/api/documents/${id}/approve`,
    REJECT: (id: string) => `/api/documents/${id}/reject`,
    TYPES: '/api/documents/types',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    BY_ID: (id: string) => `/api/notifications/${id}`,
    READ: (id: string) => `/api/notifications/${id}/read`,
    ANNOUNCEMENTS: '/api/notifications/announcements',
    HOLIDAYS: '/api/notifications/holidays',
    TASKS: '/api/notifications/tasks',
  },

  // Performance
  PERFORMANCE: {
    BASE: '/api/performance',
    BY_ID: (id: string) => `/api/performance/${id}`,
    SUBMIT: (id: string) => `/api/performance/${id}/submit`,
    APPROVE: (id: string) => `/api/performance/${id}/approve`,
    COMPLETE: (id: string) => `/api/performance/${id}/complete`,
    STATS: '/api/performance/stats/overview',
  },

  // Recruitment
  RECRUITMENT: {
    JOBS: '/api/recruitment/jobs',
    JOB_BY_ID: (id: string) => `/api/recruitment/jobs/${id}`,
    CANDIDATES: '/api/recruitment/candidates',
    APPLICATIONS: '/api/recruitment/applications',
    INTERVIEWS: '/api/recruitment/interviews',
    STATS: '/api/recruitment/stats/overview',
  },

  // Training
  TRAINING: {
    PROGRAMS: '/api/training/programs',
    SESSIONS: '/api/training/sessions',
    ENROLLMENTS: '/api/training/enrollments',
    MY_TRAININGS: '/api/training/my-trainings',
    ROADMAPS: '/api/training/roadmaps',
    STATS: '/api/training/stats/overview',
  },

  // Health Insurance
  HEALTH_INSURANCE: {
    POLICIES: '/api/health-insurance/policies',
    MY_POLICY: '/api/health-insurance/my-policy',
    DEPENDENTS: '/api/health-insurance/dependents',
    MY_DEPENDENTS: '/api/health-insurance/my-dependents',
    CLAIMS: '/api/health-insurance/claims',
    MY_CLAIMS: '/api/health-insurance/my-claims',
    PANEL_HOSPITALS: '/api/health-insurance/panel-hospitals',
    COVERAGE: '/api/health-insurance/my-coverage',
  },

  // Payroll
  PAYROLL: {
    PAYSLIPS: '/api/payroll/payslips',
    MY_PAYSLIPS: '/api/payroll/my-payslips',
    ADMIN_PAYSLIPS: '/api/payroll/admin/payslips',
    PAYSLIP_DETAILS: (id: string) => `/api/payroll/payslips/${id}/details`,
    PAYSLIP_PDF: (id: string) => `/api/payroll/payslips/${id}/pdf`,
    SALARY_STRUCTURE: '/api/payroll/my-salary-structure',
    BONUSES: '/api/payroll/my-bonuses',
    APPROVE_PAYSLIP: (id: string) => `/api/payroll/payslips/${id}/approve`,
  },

  // Requests
  REQUESTS: {
    BASE: '/api/requests',
    MY_REQUESTS: '/api/requests/my-requests',
    BY_ID: (id: string) => `/api/requests/${id}`,
    APPROVE: (id: string) => `/api/requests/${id}/approve`,
    REJECT: (id: string) => `/api/requests/${id}/reject`,
    LOGS: (id: string) => `/api/requests/${id}/logs`,
    HR_DOCUMENTS: '/api/requests/hr-documents',
    STATS: '/api/requests/stats/my-requests',
  },

  // Reports
  REPORTS: {
    ADMIN_DASHBOARD: '/api/reports/dashboard/admin',
    EMPLOYEE_DASHBOARD: '/api/reports/dashboard/employee',
    ATTENDANCE_MONTHLY: '/api/reports/attendance/monthly',
    LEAVE_SUMMARY: '/api/reports/leave/summary',
    PAYROLL_SUMMARY: '/api/reports/payroll/summary',
  },
} as const;