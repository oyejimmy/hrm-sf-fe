import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from './lib/react-query';
import { GlobalStyles } from './styles/global-styles';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { PageLoader } from './components/common/PageLoader';
import './styles/responsive.css';
import { AuthGuard } from './providers/AuthGuard';
import { SessionManager } from './providers/SessionManager';
import { DashboardRedirect } from './components/common/DashboardRedirect';

// Layout Components
import { AdminLayout } from './components/Layout/AdminLayout';
import { EmployeeLayout } from './components/Layout/EmployeeLayout';
import { TeamLeadLayout } from './components/Layout/TeamLeadLayout';

// Auth Components
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ResetPassword from './features/auth/ResetPassword';
import ChangePassword from './features/auth/ChangePassword';

// Admin Components
import AdminDashboard from './features/admin/AdminDashboard';
import EmployeeManagement from './features/admin/EmployeeManagement';
import AttendanceAndLeave from './features/admin/AttendanceAndLeave';
import AttendanceManagement from './features/admin/AttendanceManagement';
import ReportsAnalytics from './features/admin/ReportsAnalytics';
import Recruitments from './features/admin/Recruitments';
import PerformanceManagement from './features/admin/PerformanceManagement';
import DocumentManagement from './features/admin/DocumentManagement';
import CommunicationAndNotification from './features/admin/CommunicationAndNotification';
import TrainingManagement from './features/admin/TrainingManagement';
import NotificationManagement from './features/admin/NotificationManagement';

// Employee Components
import EmployeeDashboard from './features/employee/EmployeeDashboard';
import { EmployeeDashboardEnhanced } from './features/employee/EmployeeDashboardEnhanced';
import Attendance from './features/employee/EmployeeAttendance';
import AttendanceTracker from './features/employee/AttendanceTracker';
import LeaveManagement from './features/employee/EmployeeLeaveManagement';
import TrainingAndDevelopment from './features/employee/EmployeeTrainingDevelopment';
import Payslip from './features/employee/EmployeePayslip';
import Assets from './features/employee/EmployeeAssets';
import Documents from './features/employee/EmployeeDocuments';
import EmployeeProfile from './features/commonPages/profile/Profile';
import EditProfile from './features/commonPages/profile/EditProfile';
import EmployeeComplain from './features/employee/EmployeeComplain';
import EmployeeRequest from './features/employee/EmployeeRequest';
import EmployeeHealthInsurance from './features/employee/EmployeeHealthInsurance';

// Team Lead Components
import { TeamLeadDashboard } from './features/teamLead/Dashboard';
import { TeamAttendance } from './features/teamLead/TeamAttendance';
import { TeamLeaveRequests } from './features/teamLead/TeamLeaveRequests';
import { TeamPerformance } from './features/teamLead/TeamPerformance';
import { TrainingAssignments } from './features/teamLead/TrainingAssignments';
import { AuthTest } from './features/auth/AuthTest';
import StepOnboarding, { MinimalOnboarding } from './features/commonPages/onboarding';
import { OnboardingGuard } from './components/common/OnboardingGuard';
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import dayjs from 'dayjs';
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(localeData);

const AppContent: React.FC = () => {
  const { isLoading } = useLoading();
  
  return (
    <>
      {isLoading && <PageLoader />}
      <Router>
        <SessionManager>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
          <Route path="/signup" element={<AuthGuard><Signup /></AuthGuard>} />
          <Route path="/reset-password" element={<AuthGuard><ResetPassword /></AuthGuard>} />
          <Route path="/change-password" element={<AuthGuard requireAuth><ChangePassword /></AuthGuard>} />
          <Route path="/onboarding" element={<AuthGuard requireAuth><StepOnboarding /></AuthGuard>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthGuard requireAuth allowedRoles={['admin', 'hr']}>
                <OnboardingGuard>
                  <AdminLayout />
                </OnboardingGuard>
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance-leave" element={<AttendanceAndLeave />} />
            <Route path="attendance-management" element={<AttendanceManagement />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="recruitment" element={<Recruitments />} />
            <Route path="performance" element={<PerformanceManagement />} />
            <Route path="training" element={<TrainingManagement />} />
            <Route path="documents" element={<DocumentManagement />} />
            <Route path="communication" element={<CommunicationAndNotification />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <AuthGuard requireAuth allowedRoles={['employee']}>
                <OnboardingGuard>
                  <EmployeeLayout />
                </OnboardingGuard>
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboardEnhanced />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance-tracker" element={<AttendanceTracker />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="training" element={<TrainingAndDevelopment />} />
            <Route path="payslip" element={<Payslip />} />
            <Route path="health-insurance" element={<EmployeeHealthInsurance />} />
            <Route path="assets" element={<Assets />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="complain" element={<EmployeeComplain />} />
            <Route path="request" element={<EmployeeRequest />} />
          </Route>

          {/* Team Lead Routes */}
          <Route
            path="/team-lead"
            element={
              <AuthGuard requireAuth allowedRoles={['team_lead']}>
                <OnboardingGuard>
                  <TeamLeadLayout />
                </OnboardingGuard>
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeamLeadDashboard />} />
            <Route path="attendance" element={<TeamAttendance />} />
            <Route path="leave-requests" element={<TeamLeaveRequests />} />
            <Route path="performance" element={<TeamPerformance />} />
            <Route path="training" element={<TrainingAssignments />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>



          {/* Auth Test Route */}
          <Route
            path="/auth-test"
            element={
              <AuthGuard requireAuth allowedRoles={['admin', 'hr', 'team_lead', 'employee']}>
                <AuthTest />
              </AuthGuard>
            }
          />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SessionManager>
      </Router>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <GlobalStyles />
            <AppContent />
            {process.env.NODE_ENV === 'development'}
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
