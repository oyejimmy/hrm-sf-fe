import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Form,
  Spin,
  Modal,
  Grid,
} from 'antd';
import { Plus, Calendar } from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveNotificationPanel from './components/LeaveNotificationPanel';
import LeaveDashboardStats from './components/LeaveDashboardStats';
import LeaveHistoryTable from './components/LeaveHistoryTable';
import LeaveSummaryPanel from './components/LeaveSummaryPanel';
import PolicyGuidelines from './components/PolicyGuidelines';
import {
  LeaveRequest,
  LeaveNotification,
  DashboardStats,
  LeaveBalance,
  LeavePolicy,
  Employee
} from './types';
import {
  StyledCard,
} from './components/styles';
import { useMyLeaves, useCreateLeave } from '../../../hooks/api/useLeaves';

const { useBreakpoint } = Grid; // Destructure useBreakpoint hook from Ant Design Grid

const mockEmployees: Employee[] = [ // Mock employee data
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', role: 'HR Manager', avatar: '' },
  { id: '2', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', role: 'Team Lead', avatar: '' },
];

const generateMockLeaveBalances = (): LeaveBalance[] => [ // Function to generate mock leave balances
  { type: 'Annual', totalAllocated: 20, taken: 7, remaining: 13 }, // Annual leave balance
  { type: 'Sick', totalAllocated: 10, taken: 2, remaining: 8 }, // Sick leave balance
  { type: 'Casual', totalAllocated: 12, taken: 4, remaining: 8 }, // Casual leave balance
  { type: 'Maternity', totalAllocated: 180, taken: 0, remaining: 180 }, // Maternity leave balance
  { type: 'Paternity', totalAllocated: 10, taken: 0, remaining: 10 } // Paternity leave balance
];

const generateMockNotifications = (): LeaveNotification[] => [
  {
    id: 'notif-1',
    type: 'leave_approved',
    message: 'Your leave request has been approved',
    fromEmployee: 'HR Department',
    timestamp: new Date().toLocaleDateString(),
    read: false,
    priority: 'high',
    leaveRequestId: 'req-1'
  }
];

const EmployeeLeaveManagement: React.FC = () => { 
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<LeaveNotification[]>(generateMockNotifications());
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(generateMockLeaveBalances());
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [policyGuidelinesVisible, setPolicyGuidelinesVisible] = useState(false);
  const screens = useBreakpoint();

  // Use API hooks
  const { data: leaveRequests, isLoading, error, refetch } = useMyLeaves();
  const createLeaveMutation = useCreateLeave();

  // Mock stats for now - in real app, this would come from API
  const stats: DashboardStats = {
    pendingRequests: leaveRequests?.filter(req => req.status === 'pending').length || 0,
    approvedThisMonth: leaveRequests?.filter(req => req.status === 'approved').length || 0,
    rejectedThisMonth: leaveRequests?.filter(req => req.status === 'rejected').length || 0,
    onLeaveToday: 2
  };

  // Handle submission of leave request form
  const handleLeaveRequestSubmit = async (formData: any) => {
    try {
      const leaveData = {
        leave_type: formData.type,
        start_date: formData.dates[0].format('YYYY-MM-DD'),
        end_date: formData.dates[1].format('YYYY-MM-DD'),
        reason: formData.reason,
        duration: formData.dates[1].diff(formData.dates[0], 'days') + 1
      };

      await createLeaveMutation.mutateAsync(leaveData);
      setShowRequestForm(false);
      refetch(); // Refresh the leave requests list
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Notification Handlers
  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    message.success('All notifications marked as read');
  };

  const handleNotificationClick = (notification: LeaveNotification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    message.info(`Notification: ${notification.message}`);
  };

  if (error) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Error loading leave data</h3>
          <p>Please try refreshing the page</p>
        </div>
      </Wrapper>
    );
  }

  return ( // Render the Employee Leave Management component
    <Wrapper $isDarkMode={isDarkMode}> {/* Wrapper component with dark mode support */}
      <HeaderComponent // Page header component
        title="Leave Management" // Title of the page
        subtitle="Manage your leave requests and track your leave balance" // Subtitle of the page
        breadcrumbItems={[ // Breadcrumb navigation items
          { title: 'Dashboard', href: '/' },
          { title: 'Leave Management' },
        ]}
        extraButtons={[ // Extra buttons in the header
          <Button // Request Leave button
            key="request"
            type="primary"
            icon={<Plus size={16} />} // Plus icon
            onClick={() => setShowRequestForm(true)} // Open leave request form on click
            size={screens.xs ? "small" : "middle"} // Responsive button size
          >
            {screens.xs ? "Request" : "Request Leave"} {/* Responsive button text */}
          </Button>,
          <Button // Policy Guidelines button
            key="policy-guidelines"
            icon={<Calendar size={16} />} // Calendar icon (can be changed)
            onClick={() => setPolicyGuidelinesVisible(true)} // Open policy guidelines modal on click
            size={screens.xs ? "small" : "middle"} // Responsive button size
          >
            {screens.xs ? "Policies" : "Policy Guidelines"} {/* Responsive button text */}
          </Button>
        ]}
        isDarkMode={isDarkMode} // Pass dark mode status to header
      />

      <Spin spinning={isLoading || createLeaveMutation.isPending}> {/* Show spinner when loading */}
        <Row gutter={[16, 16]}> {/* Ant Design Row with gutter */}
          {/* Left Column - Main Content */}
          <Col xs={24} lg={16}> {/* Column for main content, responsive sizing */}
            <LeaveDashboardStats stats={stats} loading={isLoading} /> {/* Render LeaveDashboardStats */}
            <StyledCard // Styled card for Leave History
              title="Leave History"
              isDarkMode={isDarkMode}
              style={{ marginTop: 16 }}
            >
              <LeaveHistoryTable leaveRequests={leaveRequests || []} loading={isLoading} /> {/* Leave history table component */}
            </StyledCard>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}> {/* Column for sidebar, responsive sizing */}
            <StyledCard title="Leave Balance" isDarkMode={isDarkMode}> {/* Styled card for Leave Balance */}
              <LeaveSummaryPanel leaveBalances={leaveBalances} /> {/* Leave summary panel component */}
            </StyledCard>
            <LeaveNotificationPanel // Leave notification panel component
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </Col>
        </Row>
      </Spin>
      <Modal // Modal for Policy Guidelines
        title="Policy Guidelines"
        open={policyGuidelinesVisible}
        onCancel={() => setPolicyGuidelinesVisible(false)} // Close modal on cancel
        footer={null} // No footer buttons
        width={screens.xs ? "100%" : 1000} // Responsive modal width
        centered // Center the modal
        bodyStyle={{ padding: screens.xs ? '8px' : '16px' }} // Responsive body padding
      >
        <PolicyGuidelines /> {/* Policy guidelines component */}
      </Modal>
      <LeaveRequestForm // Leave request form component
        visible={showRequestForm}
        onCancel={() => setShowRequestForm(false)} // Close form on cancel
        onSubmit={handleLeaveRequestSubmit} // Handle form submission
        loading={createLeaveMutation.isPending}
        employees={mockEmployees}
      />
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;