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
  Space
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
import { useMyLeaves, useCreateLeave, useDeleteLeave } from '../../../hooks/api/useLeaves';
import { useLeaveBalance } from '../../../hooks/api/useLeaveBalance';
import dayjs from 'dayjs';

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
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [policyGuidelinesVisible, setPolicyGuidelinesVisible] = useState(false);
  const screens = useBreakpoint();

  // Use API hooks with fallback data
  const { data: leaveRequests, isLoading, error, refetch } = useMyLeaves();
  const { data: leaveBalances, isLoading: balanceLoading } = useLeaveBalance();
  const createLeaveMutation = useCreateLeave();
  const { mutate: cancelLeave } = useDeleteLeave();
  
  // Mock data fallback
  const mockLeaveRequests = [
    {
      id: 1,
      employee_id: 1,
      leave_type: 'Annual',
      start_date: '2024-01-15',
      end_date: '2024-01-20',
      duration: 5,
      reason: 'Family vacation',
      status: 'pending' as const,
      created_at: '2024-01-10'
    },
    {
      id: 2,
      employee_id: 1,
      leave_type: 'Sick',
      start_date: '2024-01-25',
      end_date: '2024-01-26',
      duration: 2,
      reason: 'Medical appointment',
      status: 'approved' as const,
      created_at: '2024-01-20'
    }
  ];
  
  const displayLeaves = leaveRequests || mockLeaveRequests;

  // Calculate stats from data
  const stats: DashboardStats = {
    pendingRequests: (displayLeaves as any[]).filter((req: any) => req.status === 'pending').length || 0,
    approvedThisMonth: (displayLeaves as any[]).filter((req: any) => {
      const isThisMonth = dayjs(req.created_at).isSame(dayjs(), 'month');
      return req.status === 'approved' && isThisMonth;
    }).length || 0,
    rejectedThisMonth: (displayLeaves as any[]).filter((req: any) => {
      const isThisMonth = dayjs(req.created_at).isSame(dayjs(), 'month');
      return req.status === 'rejected' && isThisMonth;
    }).length || 0,
    onLeaveToday: (displayLeaves as any[]).filter((req: any) => {
      const today = dayjs();
      return req.status === 'approved' && 
             today.isBetween(dayjs(req.start_date), dayjs(req.end_date), 'day', '[]');
    }).length || 0
  };

  const handleLeaveRequestSubmit = async (formData: any) => {
    console.log('Form data received:', formData);
    try {
      const leaveData = {
        leave_type: formData.type,
        start_date: formData.dates[0].format('YYYY-MM-DD'),
        end_date: formData.dates[1].format('YYYY-MM-DD'),
        reason: formData.reason,
        duration: formData.duration || (formData.dates[1].diff(formData.dates[0], 'days') + 1)
      };
      
      console.log('Submitting leave data:', leaveData);
      await createLeaveMutation.mutateAsync(leaveData);
      refetch();
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };
  
  // Handle cancellation of leave request
  const handleCancelRequest = (id: string) => {
    cancelLeave(id, {
      onSuccess: () => {
        refetch();
        message.success('Leave request cancelled successfully');
      },
      onError: () => {
        message.error('Failed to cancel leave request');
      }
    });
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
          <Button
            key="policy-guidelines"
            icon={<Calendar size={16} />}
            onClick={() => setPolicyGuidelinesVisible(true)}
            size={screens.xs ? "small" : "middle"}
          >
            {screens.xs ? "Policies" : "Policy Guidelines"}
          </Button>,

        ]}
        isDarkMode={isDarkMode} // Pass dark mode status to header
      />

      <Spin spinning={isLoading || createLeaveMutation.isPending || balanceLoading}> {/* Show spinner when loading */}
        <Row gutter={[16, 16]}> {/* Ant Design Row with gutter */}
          {/* Left Column - Main Content */}
          <Col xs={24} lg={16}> {/* Column for main content, responsive sizing */}
            <LeaveDashboardStats stats={stats} loading={isLoading} /> {/* Render LeaveDashboardStats */}
            <StyledCard
              title="Leave History"
              isDarkMode={isDarkMode}
              style={{ marginTop: 16 }}
              extra={
                <Space>
                  <Button 
                    size="small" 
                    icon={<Calendar size={14} />}
                    onClick={() => message.info('Calendar view coming soon')}
                  >
                    {screens.xs ? 'Calendar' : 'Calendar View'}
                  </Button>
                </Space>
              }
            >
              <LeaveHistoryTable 
                leaveRequests={displayLeaves} 
                loading={isLoading}
                onCancelRequest={handleCancelRequest}
              />
            </StyledCard>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}> {/* Column for sidebar, responsive sizing */}
            <StyledCard title="Leave Balance" isDarkMode={isDarkMode}>
              <LeaveSummaryPanel leaveBalances={leaveBalances || generateMockLeaveBalances()} />
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
      <LeaveRequestForm
        visible={showRequestForm}
        onCancel={() => setShowRequestForm(false)}
        onSubmit={handleLeaveRequestSubmit}
        loading={createLeaveMutation.isPending}
        employees={mockEmployees}
        leaveBalances={leaveBalances || generateMockLeaveBalances()}
      />
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;