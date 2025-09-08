// src/routes/index.tsx
import React from "react";
import { Navigate } from "react-router-dom";

// Employee Pages
import EmployeeDashboard from "../features/employee/Dashboard";
import Attendance from "../features/employee/Attendance";
import LeaveManagement from "../features/employee/LeaveManagement";
import TrainingAndDevelopment from "../features/employee/TrainingAndDevelopment";
import Payslip from "../features/employee/Payslip";
import Assets from "../features/employee/Assets";
import Documents from "../features/employee/Documents";

// Profile Page
import EmployeeProfile from "../features/profile";

// Admin Pages (placeholders for now)
import AdminDashboard from "../features/admin/Dashboard";
import Reports from "../features/admin/Reports";
import Employees from "../features/admin/Employees";

// Route Constants
export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    EMPLOYEES: "/admin/employees",
    ATTENDANCE_LEAVE: "/admin/attendance-leave",
    REPORTS: "/admin/reports",
    RECRUITMENT: "/admin/recruitment",
    PERFORMANCE: "/admin/performance",
    TRAINING: "/admin/training",
    DOCUMENTS: "/admin/documents",
    COMMUNICATION: "/admin/communication",
  },

  EMPLOYEE: {
    DASHBOARD: "/employee/dashboard",
    ATTENDANCE: "/employee/attendance",
    LEAVE: "/employee/leave",
    TRAINING: "/employee/training",
    PAYSLIP: "/employee/payslip",
    ASSETS: "/employee/assets",
    DOCUMENTS: "/employee/documents",
  },

  TEAM_LEAD: {
    DASHBOARD: "/team-lead/dashboard",
    ATTENDANCE: "/team-lead/attendance",
    LEAVE_REQUESTS: "/team-lead/leave-requests",
    PERFORMANCE: "/team-lead/performance",
    TRAINING: "/team-lead/training",
  },

  PROFILE: "/profile",
  HOME: "/",
};

// Route Permissions
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  [ROUTES.ADMIN.DASHBOARD]: ["admin", "hr"],
  [ROUTES.ADMIN.EMPLOYEES]: ["admin", "hr"],
  [ROUTES.ADMIN.ATTENDANCE_LEAVE]: ["admin", "hr"],
  [ROUTES.ADMIN.REPORTS]: ["admin", "hr"],
  [ROUTES.ADMIN.RECRUITMENT]: ["admin", "hr"],
  [ROUTES.ADMIN.PERFORMANCE]: ["admin", "hr"],
  [ROUTES.ADMIN.TRAINING]: ["admin", "hr"],
  [ROUTES.ADMIN.DOCUMENTS]: ["admin", "hr"],
  [ROUTES.ADMIN.COMMUNICATION]: ["admin", "hr"],

  [ROUTES.EMPLOYEE.DASHBOARD]: ["employee"],
  [ROUTES.EMPLOYEE.ATTENDANCE]: ["employee"],
  [ROUTES.EMPLOYEE.LEAVE]: ["employee"],
  [ROUTES.EMPLOYEE.TRAINING]: ["employee"],
  [ROUTES.EMPLOYEE.PAYSLIP]: ["employee"],
  [ROUTES.EMPLOYEE.ASSETS]: ["employee"],
  [ROUTES.EMPLOYEE.DOCUMENTS]: ["employee"],

  [ROUTES.TEAM_LEAD.DASHBOARD]: ["team_lead"],
  [ROUTES.TEAM_LEAD.ATTENDANCE]: ["team_lead"],
  [ROUTES.TEAM_LEAD.LEAVE_REQUESTS]: ["team_lead"],
  [ROUTES.TEAM_LEAD.PERFORMANCE]: ["team_lead"],
  [ROUTES.TEAM_LEAD.TRAINING]: ["team_lead"],

  [ROUTES.PROFILE]: ["admin", "hr", "team_lead", "employee"],
};

// All Route Definitions
export const APP_ROUTES = [
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.EMPLOYEE.DASHBOARD} /> },

  // Employee
  { path: ROUTES.EMPLOYEE.DASHBOARD, element: <EmployeeDashboard /> },
  { path: ROUTES.EMPLOYEE.ATTENDANCE, element: <Attendance /> },
  { path: ROUTES.EMPLOYEE.LEAVE, element: <LeaveManagement /> },
  { path: ROUTES.EMPLOYEE.TRAINING, element: <TrainingAndDevelopment /> },
  { path: ROUTES.EMPLOYEE.PAYSLIP, element: <Payslip /> },
  { path: ROUTES.EMPLOYEE.ASSETS, element: <Assets /> },
  { path: ROUTES.EMPLOYEE.DOCUMENTS, element: <Documents /> },

  // Profile
  { path: ROUTES.PROFILE, element: <EmployeeProfile /> },

  // Admin (placeholders)
  { path: ROUTES.ADMIN.DASHBOARD, element: <AdminDashboard /> },
  { path: ROUTES.ADMIN.REPORTS, element: <Reports /> },
  { path: ROUTES.ADMIN.EMPLOYEES, element: <Employees /> },
];
