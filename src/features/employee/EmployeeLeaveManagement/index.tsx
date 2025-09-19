import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Form,
  Spin,
  Modal,
  Typography,
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

const { useBreakpoint } = Grid;

// Mock data generators
const generateMockLeaveRequests = (): LeaveRequest[] => {
  const statuses: ('Approved' | 'Pending' | 'Rejected' | 'On Hold')[] = ['Approved', 'Pending', 'Rejected', 'On Hold'];
  const types = ['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid'];
  const durationTypes = ['Full Day', 'Half Day - Morning', 'Half Day - Afternoon'];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `req-${i + 1}`,
    employeeId: 'current-user',
    employeeName: 'John Doe',
    employeeEmail: 'john.doe@company.com',
    department: 'Engineering',
    type: types[Math.floor(Math.random() * types.length)] as any,
    durationType: durationTypes[Math.floor(Math.random() * durationTypes.length)] as any,
    from: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: Math.floor(Math.random() * 10) + 1,
    reason: ['Family vacation', 'Medical appointment', 'Personal reasons', 'Family emergency', 'Rest'][Math.floor(Math.random() * 5)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    recipientDetails: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      id: `recip-${j + 1}`,
      name: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez'][j],
      role: ['HR Manager', 'Team Lead', 'Department Head'][j],
      email: `recipient${j + 1}@company.com`,
      department: ['HR', 'Engineering', 'Operations'][j],
      avatar: ''
    })),
    adminComments: Math.random() > 0.7 ? 'Please provide medical certificate' : undefined,
    attachmentUrl: Math.random() > 0.8 ? '/dummy-file.pdf' : undefined
  }));
};

const generateMockNotifications = (): LeaveNotification[] => {
  const types = ['leave_request', 'leave_approved', 'leave_rejected', 'leave_on_hold', 'details_requested'];
  const priorities = ['high', 'medium', 'low'];

  return Array.from({ length: 8 }, (_, i) => ({
    id: `notif-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)] as any,
    message: [
      'Your leave request has been approved',
      'New leave request requires your approval',
      'Your leave request has been put on hold pending additional information',
      'Your leave request was rejected due to scheduling conflicts',
      'Additional details required for your leave request'
    ][Math.floor(Math.random() * 5)],
    fromEmployee: ['John Doe', 'Jane Smith', 'HR Department'][Math.floor(Math.random() * 3)],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    read: Math.random() > 0.5,
    priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
    leaveRequestId: `req-${Math.floor(Math.random() * 15) + 1}`
  }));
};

const generateMockStats = (): DashboardStats => ({
  pendingRequests: Math.floor(Math.random() * 15) + 5,
  approvedThisMonth: Math.floor(Math.random() * 20) + 10,
  rejectedThisMonth: Math.floor(Math.random() * 5) + 1,
  onLeaveToday: Math.floor(Math.random() * 8) + 2
});

const generateMockLeaveBalances = (): LeaveBalance[] => [
  { type: 'Annual', totalAllocated: 20, taken: 7, remaining: 13 },
  { type: 'Sick', totalAllocated: 10, taken: 2, remaining: 8 },
  { type: 'Casual', totalAllocated: 12, taken: 4, remaining: 8 },
  { type: 'Maternity', totalAllocated: 180, taken: 0, remaining: 180 },
  { type: 'Paternity', totalAllocated: 10, taken: 0, remaining: 10 }
];

const generateMockPolicies = (): LeavePolicy[] => [
  {
    type: 'Annual Leave',
    eligibility: 'All full-time employees after 3 months of service',
    workflow: 'Submit at least 2 weeks in advance for approval',
    documentation: 'No documentation required'
  },
  {
    type: 'Sick Leave',
    eligibility: 'All employees from date of joining',
    workflow: 'Notify manager on first day of absence',
    documentation: 'Medical certificate required for absences longer than 3 days'
  }
];

const mockEmployees: Employee[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', role: 'HR Manager', avatar: '' },
  { id: '2', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', role: 'Team Lead', avatar: '' },
];

// Mock API functions
const leaveApi = {
  getMyLeaveRequests: async (): Promise<LeaveRequest[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockLeaveRequests()), 800);
    });
  },

  getLeaveNotifications: async (): Promise<LeaveNotification[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockNotifications()), 600);
    });
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockStats()), 500);
    });
  },

  getLeaveBalance: async (employeeId: string): Promise<LeaveBalance[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockLeaveBalances()), 400);
    });
  },

  getLeavePolicies: async (): Promise<LeavePolicy[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockPolicies()), 300);
    });
  },

  createLeaveRequest: async (request: LeaveRequest): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        message.info(`HR has been notified of your leave request`);
        resolve();
      }, 1000);
    });
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500);
    });
  }
};

const EmployeeLeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<LeaveNotification[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [policyGuidelinesVisible, setPolicyGuidelinesVisible] = useState(false);

  const [form] = Form.useForm();
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();

  // Fetch all data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requests, notifs, statsData, balances, policiesData] = await Promise.all([
        leaveApi.getMyLeaveRequests(),
        leaveApi.getLeaveNotifications(),
        leaveApi.getDashboardStats(),
        leaveApi.getLeaveBalance('current-user'),
        leaveApi.getLeavePolicies()
      ]);

      setLeaveRequests(requests);
      setNotifications(notifs);
      setStats(statsData);
      setLeaveBalances(balances);
      setPolicies(policiesData);
    } catch (error) {
      message.error('Failed to load leave management data');
    } finally {
      setLoading(false);
    }
  };

  // Submit Leave Request
  const handleLeaveRequestSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: 'current-user',
        employeeName: 'John Doe',
        employeeEmail: 'john.doe@company.com',
        department: 'Engineering',
        ...formData,
        from: formData.dates[0].format('YYYY-MM-DD'),
        to: formData.dates[1].format('YYYY-MM-DD'),
        duration: formData.dates[1].diff(formData.dates[0], 'days') + 1,
        status: 'Pending',
        appliedAt: new Date().toISOString(),
        recipientDetails: formData.recipientDetails || []
      };

      await leaveApi.createLeaveRequest(newRequest);
      setLeaveRequests(prev => [newRequest, ...prev]);
      setStats(prev => prev ? { ...prev, pendingRequests: prev.pendingRequests + 1 } : null);

      // Add notification for HR
      const newNotification: LeaveNotification = {
        id: `notif-${Date.now()}`,
        type: 'leave_request',
        message: `New leave request from John Doe (${formData.type} Leave)`,
        fromEmployee: 'John Doe',
        timestamp: new Date().toLocaleDateString(),
        read: false,
        priority: 'medium',
        leaveRequestId: newRequest.id
      };

      setNotifications(prev => [newNotification, ...prev]);

      message.success('Leave request submitted successfully! HR has been notified.');
      setShowRequestForm(false);
    } catch (error) {
      message.error('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  // Notification Handlers
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await leaveApi.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await leaveApi.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      message.success('All notifications marked as read');
    } catch {
      message.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = (notification: LeaveNotification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    message.info(`Notification: ${notification.message}`);
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        title="Leave Management"
        subtitle="Manage your leave requests and track your leave balance"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Leave Management' },
        ]}
        extraButtons={[
          <Button
            key="request"
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowRequestForm(true)}
            size={screens.xs ? "small" : "middle"}
          >
            {screens.xs ? "Request" : "Request Leave"}
          </Button>,
          <Button
            key="policy-guidelines"
            icon={<Calendar size={16} />} // Reusing Calendar icon for now, can be changed later
            onClick={() => setPolicyGuidelinesVisible(true)}
            size={screens.xs ? "small" : "middle"}
          >
            {screens.xs ? "Policies" : "Policy Guidelines"}
          </Button>
        ]}
        isDarkMode={isDarkMode}
      />

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {/* Left Column - Main Content */}
          <Col xs={24} lg={16}>
            {stats && <LeaveDashboardStats stats={stats} loading={loading} />}
            <StyledCard
              title="Leave History"
              isDarkMode={isDarkMode}
              style={{ marginTop: 16 }}
            >
              <LeaveHistoryTable leaveRequests={leaveRequests} loading={loading} />
            </StyledCard>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}>
            <StyledCard title="Leave Balance" isDarkMode={isDarkMode}>
              <LeaveSummaryPanel leaveBalances={leaveBalances} />
            </StyledCard>
            <LeaveNotificationPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </Col>
        </Row>
      </Spin>
      <Modal
        title="Policy Guidelines"
        open={policyGuidelinesVisible}
        onCancel={() => setPolicyGuidelinesVisible(false)}
        footer={null}
        width={screens.xs ? "100%" : 1000}
        centered
        bodyStyle={{ padding: screens.xs ? '8px' : '16px' }}
      >
        <PolicyGuidelines />
      </Modal>
        <LeaveRequestForm
          visible={showRequestForm}
          onCancel={() => setShowRequestForm(false)}
          onSubmit={handleLeaveRequestSubmit}
          loading={loading}
          employees={mockEmployees}
        />
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;