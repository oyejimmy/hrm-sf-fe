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

const { useBreakpoint } = Grid; // Destructure useBreakpoint hook from Ant Design Grid

// Mock data generators
const generateMockLeaveRequests = (): LeaveRequest[] => { // Function to generate mock leave requests
  const statuses: ('Approved' | 'Pending' | 'Rejected' | 'On Hold')[] = ['Approved', 'Pending', 'Rejected', 'On Hold']; // Define possible leave statuses
  const types = ['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid']; // Define possible leave types
  const durationTypes = ['Full Day', 'Half Day - Morning', 'Half Day - Afternoon']; // Define possible duration types

  return Array.from({ length: 15 }, (_, i) => ({ // Generate 15 mock leave requests
    id: `req-${i + 1}`, // Unique request ID
    employeeId: 'current-user',
    employeeName: 'John Doe',
    employeeEmail: 'john.doe@company.com',
    department: 'Engineering',
    type: types[Math.floor(Math.random() * types.length)] as any, // Random leave type
    durationType: durationTypes[Math.floor(Math.random() * durationTypes.length)] as any, // Random duration type
    from: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random start date
    to: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random end date
    duration: Math.floor(Math.random() * 10) + 1, // Random duration in days
    reason: ['Family vacation', 'Medical appointment', 'Personal reasons', 'Family emergency', 'Rest'][Math.floor(Math.random() * 5)], // Random reason
    status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
    appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(), // Random applied date
    recipientDetails: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({ // Generate mock recipient details
      id: `recip-${j + 1}`,
      name: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez'][j],
      role: ['HR Manager', 'Team Lead', 'Department Head'][j],
      email: `recipient${j + 1}@company.com`,
      department: ['HR', 'Engineering', 'Operations'][j],
      avatar: ''
    })),
    adminComments: Math.random() > 0.7 ? 'Please provide medical certificate' : undefined, // Optional admin comments
    attachmentUrl: Math.random() > 0.8 ? '/dummy-file.pdf' : undefined // Optional attachment URL
  }));
};

const generateMockNotifications = (): LeaveNotification[] => { // Function to generate mock notifications
  const types = ['leave_request', 'leave_approved', 'leave_rejected', 'leave_on_hold', 'details_requested']; // Define possible notification types
  const priorities = ['high', 'medium', 'low']; // Define possible notification priorities

  return Array.from({ length: 8 }, (_, i) => ({ // Generate 8 mock notifications
    id: `notif-${i + 1}`, // Unique notification ID
    type: types[Math.floor(Math.random() * types.length)] as any, // Random notification type
    message: [ // Random notification message
      'Your leave request has been approved',
      'New leave request requires your approval',
      'Your leave request has been put on hold pending additional information',
      'Your leave request was rejected due to scheduling conflicts',
      'Additional details required for your leave request'
    ][Math.floor(Math.random() * 5)],
    fromEmployee: ['John Doe', 'Jane Smith', 'HR Department'][Math.floor(Math.random() * 3)], // Random sender
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Random timestamp
    read: Math.random() > 0.5, // Random read status
    priority: priorities[Math.floor(Math.random() * priorities.length)] as any, // Random priority
    leaveRequestId: `req-${Math.floor(Math.random() * 15) + 1}` // Associated leave request ID
  }));
};

const generateMockStats = (): DashboardStats => ({ // Function to generate mock dashboard statistics
  pendingRequests: Math.floor(Math.random() * 15) + 5, // Random number of pending requests
  approvedThisMonth: Math.floor(Math.random() * 20) + 10, // Random number of approved requests this month
  rejectedThisMonth: Math.floor(Math.random() * 5) + 1, // Random number of rejected requests this month
  onLeaveToday: Math.floor(Math.random() * 8) + 2 // Random number of employees on leave today
});

const generateMockLeaveBalances = (): LeaveBalance[] => [ // Function to generate mock leave balances
  { type: 'Annual', totalAllocated: 20, taken: 7, remaining: 13 }, // Annual leave balance
  { type: 'Sick', totalAllocated: 10, taken: 2, remaining: 8 }, // Sick leave balance
  { type: 'Casual', totalAllocated: 12, taken: 4, remaining: 8 }, // Casual leave balance
  { type: 'Maternity', totalAllocated: 180, taken: 0, remaining: 180 }, // Maternity leave balance
  { type: 'Paternity', totalAllocated: 10, taken: 0, remaining: 10 } // Paternity leave balance
];

const generateMockPolicies = (): LeavePolicy[] => [ // Function to generate mock leave policies
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

const mockEmployees: Employee[] = [ // Mock employee data
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', role: 'HR Manager', avatar: '' },
  { id: '2', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', role: 'Team Lead', avatar: '' },
];

// Mock API functions for leave management
const leaveApi = {
  getMyLeaveRequests: async (): Promise<LeaveRequest[]> => { // Fetches mock leave requests for the current user
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockLeaveRequests()), 800); // Simulate API call delay
    });
  },

  getLeaveNotifications: async (): Promise<LeaveNotification[]> => { // Fetches mock leave notifications
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockNotifications()), 600); // Simulate API call delay
    });
  },

  getDashboardStats: async (): Promise<DashboardStats> => { // Fetches mock dashboard statistics
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockStats()), 500); // Simulate API call delay
    });
  },

  getLeaveBalance: async (employeeId: string): Promise<LeaveBalance[]> => { // Fetches mock leave balances for a given employee
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockLeaveBalances()), 400); // Simulate API call delay
    });
  },

  getLeavePolicies: async (): Promise<LeavePolicy[]> => { // Fetches mock leave policies
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockPolicies()), 300); // Simulate API call delay
    });
  },

  createLeaveRequest: async (request: LeaveRequest): Promise<void> => { // Simulates creating a leave request
    return new Promise(resolve => {
      setTimeout(() => {
        message.info(`HR has been notified of your leave request`); // Display success message
        resolve();
      }, 1000); // Simulate API call delay
    });
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => { // Simulates marking a notification as read
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300); // Simulate API call delay
    });
  },

  markAllNotificationsAsRead: async (): Promise<void> => { // Simulates marking all notifications as read
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500); // Simulate API call delay
    });
  }
};

const EmployeeLeaveManagement: React.FC = () => { 
  const { isDarkMode } = useTheme(); // Get dark mode status from theme context
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]); // State for leave requests
  const [notifications, setNotifications] = useState<LeaveNotification[]>([]); // State for notifications
  const [stats, setStats] = useState<DashboardStats | null>(null); // State for dashboard statistics
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]); // State for leave balances
  const [policies, setPolicies] = useState<LeavePolicy[]>([]); // State for leave policies
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [showRequestForm, setShowRequestForm] = useState(false); // State to control leave request form visibility
  const [policyGuidelinesVisible, setPolicyGuidelinesVisible] = useState(false); // State to control policy guidelines modal visibility
  const screens = useBreakpoint(); // Get current breakpoint for responsive design

  // Fetch all data on component mount
  useEffect(() => {
    fetchData(); // Call fetchData function
  }, []); // Empty dependency array ensures this runs once on mount

  const fetchData = async () => { // Function to fetch all necessary data
    setLoading(true); // Set loading to true
    try {
      const [requests, notifs, statsData, balances, policiesData] = await Promise.all([ // Fetch data concurrently
        leaveApi.getMyLeaveRequests(),
        leaveApi.getLeaveNotifications(),
        leaveApi.getDashboardStats(),
        leaveApi.getLeaveBalance('current-user'),
        leaveApi.getLeavePolicies()
      ]);

      setLeaveRequests(requests); // Update leave requests state
      setNotifications(notifs); // Update notifications state
      setStats(statsData); // Update dashboard stats state
      setLeaveBalances(balances); // Update leave balances state
      setPolicies(policiesData); // Update policies state
    } catch (error) {
      message.error('Failed to load leave management data'); // Display error message on failure
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // Handle submission of leave request form
  const handleLeaveRequestSubmit = async (formData: any) => { // Function to handle leave request submission
    setLoading(true); // Set loading to true
    try {
      const newRequest: LeaveRequest = { // Create new leave request object
        id: Date.now().toString(), // Generate unique ID
        employeeId: 'current-user',
        employeeName: 'John Doe',
        employeeEmail: 'john.doe@company.com',
        department: 'Engineering',
        ...formData, // Spread form data
        from: formData.dates[0].format('YYYY-MM-DD'), // Format start date
        to: formData.dates[1].format('YYYY-MM-DD'), // Format end date
        duration: formData.dates[1].diff(formData.dates[0], 'days') + 1, // Calculate duration
        status: 'Pending', // Set initial status to Pending
        appliedAt: new Date().toISOString(), // Set applied date
        recipientDetails: formData.recipientDetails || [] // Set recipient details
      };

      await leaveApi.createLeaveRequest(newRequest); // Call API to create leave request
      setLeaveRequests(prev => [newRequest, ...prev]); // Add new request to the list
      setStats(prev => prev ? { ...prev, pendingRequests: prev.pendingRequests + 1 } : null); // Update pending requests count

      // Add notification for HR about the new leave request
      const newNotification: LeaveNotification = { // Create new notification object
        id: `notif-${Date.now()}`,
        type: 'leave_request',
        message: `New leave request from John Doe (${formData.type} Leave)`,
        fromEmployee: 'John Doe',
        timestamp: new Date().toLocaleDateString(),
        read: false,
        priority: 'medium',
        leaveRequestId: newRequest.id
      };

      setNotifications(prev => [newNotification, ...prev]); // Add new notification to the list

      message.success('Leave request submitted successfully! HR has been notified.'); // Display success message
      setShowRequestForm(false); // Close the request form
    } catch (error) {
      message.error('Failed to submit leave request'); // Display error message on failure
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Notification Handlers
  const handleMarkAsRead = async (notificationId: string) => { // Function to mark a single notification as read
    try {
      await leaveApi.markNotificationAsRead(notificationId); // Call API to mark as read
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n)); // Update notification status in state
    } catch {
      message.error('Failed to mark notification as read'); // Display error message on failure
    }
  };

  const handleMarkAllAsRead = async () => { // Function to mark all notifications as read
    try {
      await leaveApi.markAllNotificationsAsRead(); // Call API to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, read: true }))); // Update all notifications status in state
      message.success('All notifications marked as read'); // Display success message
    } catch {
      message.error('Failed to mark all as read'); // Display error message on failure
    }
  };

  const handleNotificationClick = (notification: LeaveNotification) => { // Function to handle notification click
    // Mark as read when clicked
    if (!notification.read) { // Check if notification is unread
      handleMarkAsRead(notification.id); // Mark as read
    }

    message.info(`Notification: ${notification.message}`); // Display notification message
  };

  return ( // Render the Employee Leave Management component
    <Wrapper isDarkMode={isDarkMode}> {/* Wrapper component with dark mode support */}
      <HeaderComponent // Page header component
        title="Leave Management" // Title of the page
        subtitle="Manage your leave requests and track your leave balance" // Subtitle of the page
        breadcrumbItems={[ // Breadcrumb navigation items
          { title: 'Home', href: '/' },
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

      <Spin spinning={loading}> {/* Show spinner when loading */}
        <Row gutter={[16, 16]}> {/* Ant Design Row with gutter */}
          {/* Left Column - Main Content */}
          <Col xs={24} lg={16}> {/* Column for main content, responsive sizing */}
            {stats && <LeaveDashboardStats stats={stats} loading={loading} />} {/* Render LeaveDashboardStats if stats exist */}
            <StyledCard // Styled card for Leave History
              title="Leave History"
              isDarkMode={isDarkMode}
              style={{ marginTop: 16 }}
            >
              <LeaveHistoryTable leaveRequests={leaveRequests} loading={loading} /> {/* Leave history table component */}
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
        loading={loading}
        employees={mockEmployees}
      />
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;