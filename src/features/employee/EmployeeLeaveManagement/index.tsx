import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Card,
  Space,
  Tabs,
  Form
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveApprovalWorkflow from './components/LeaveApprovalWorkflow';
import LeaveNotificationPanel from './components/LeaveNotificationPanel';
import LeaveDashboardStats from './components/LeaveDashboardStats';
import LeaveHistoryTable from './components/LeaveHistoryTable';
import LeaveSummaryPanel from './components/LeaveSummaryPanel';
import LeaveCalendar from './components/LeaveCalendar';
import PolicyGuidelines from './components/PolicyGuidelines';
import {
  LeaveRequest,
  LeaveNotification,
  DashboardStats,
  LeaveApprovalRequest,
  LeaveBalance,
  LeavePolicy
} from './types';
import { leaveApi } from '../../../services/api/leaveApi';

const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border: 1px solid var(--border-color);
  .ant-card-head-title {
    color: var(--text-color);
  }
`;

// Mock data - replace with API calls
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    employeeEmail: 'john.doe@company.com',
    department: 'Engineering',
    type: 'Annual',
    from: '2024-01-15',
    to: '2024-01-20',
    duration: 5,
    durationType: 'Full Day',
    reason: 'Family vacation',
    recipients: ['hr1', 'tl1'],
    recipientDetails: [
      { id: 'hr1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', role: 'HR Manager' },
      { id: 'tl1', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', role: 'Team Lead' }
    ],
    status: 'Pending',
    appliedAt: '2024-01-10T10:00:00Z'
  }
];

const mockNotifications: LeaveNotification[] = [
  {
    id: '1',
    type: 'leave_request',
    message: 'New leave request from John Doe requires approval',
    leaveRequestId: '1',
    fromEmployee: 'John Doe',
    timestamp: '2 hours ago',
    read: false,
    priority: 'medium'
  }
];

const mockStats: DashboardStats = {
  pendingRequests: 3,
  approvedThisMonth: 12,
  rejectedThisMonth: 2,
  onLeaveToday: 5
};

const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Annual', taken: 8, remaining: 12, totalAllocated: 20 },
  { type: 'Sick', taken: 2, remaining: 8, totalAllocated: 10 },
  { type: 'Casual', taken: 2, remaining: 5, totalAllocated: 7 }
];

const mockPolicies: LeavePolicy[] = [
  {
    type: 'Annual Leave',
    eligibility: 'All full-time employees are eligible after 6 months of service.',
    workflow: 'Employees must submit a leave request through the HR portal at least 2 weeks in advance. Manager approval is required.',
    documentation: 'Company Leave Policy V2.1'
  },
  {
    type: 'Sick Leave',
    eligibility: 'All employees are eligible from their start date.',
    workflow: 'For absences of 3 or more days, a doctor\'s note is required. Notify your manager by 9 AM on the first day of absence.',
    documentation: 'Sick Leave Policy Addendum'
  },
  {
    type: 'Casual Leave',
    eligibility: 'All full-time employees are eligible after 3 months of service.',
    workflow: 'Requires manager approval. Should be used for unforeseen personal matters.',
    documentation: 'N/A'
  }
];

const EmployeeLeaveManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [form] = Form.useForm();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [notifications, setNotifications] = useState<LeaveNotification[]>(mockNotifications);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [leaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [policies] = useState<LeavePolicy[]>(mockPolicies);
  const [loading, setLoading] = useState(false);

  const { isDarkMode } = useTheme();

  const handleLeaveRequestSubmit = async (formData: any) => {
    setLoading(true);
    try {
      // Create leave request
      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: 'current-user',
        employeeName: 'Current User',
        employeeEmail: 'current@company.com',
        department: 'Engineering',
        ...formData,
        from: formData.dates[0].format('YYYY-MM-DD'),
        to: formData.dates[1].format('YYYY-MM-DD'),
        duration: formData.dates[1].diff(formData.dates[0], 'days') + 1,
        status: 'Pending'
      };

      // Add to requests
      setLeaveRequests(prev => [newRequest, ...prev]);

      // Trigger email notifications
      await leaveApi.sendLeaveNotificationEmail({
        requestId: newRequest.id,
        recipientIds: newRequest.recipients,
        type: 'request'
      });

      // Update stats
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));

      message.success('Leave request submitted successfully! Notifications sent to selected recipients.');
      setShowRequestForm(false);
    } catch (error) {
      message.error('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (approval: LeaveApprovalRequest) => {
    setLoading(true);
    try {
      // Process approval
      await leaveApi.processLeaveApproval(approval);

      // Update request status
      setLeaveRequests(prev => prev.map(req =>
        req.id === approval.requestId
          ? {
              ...req,
              status: approval.action === 'approve' ? 'Approved' :
                      approval.action === 'reject' ? 'Rejected' :
                      approval.action === 'hold' ? 'On Hold' : req.status,
              adminComments: approval.comments
            }
          : req
      ));

      // Update stats
      if (approval.action === 'approve') {
        setStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests - 1,
          approvedThisMonth: prev.approvedThisMonth + 1
        }));
      } else if (approval.action === 'reject') {
        setStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests - 1,
          rejectedThisMonth: prev.rejectedThisMonth + 1
        }));
      }

      message.success(`Leave request ${approval.action}d successfully`);
    } catch (error) {
      message.error('Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: LeaveNotification) => {
    // No longer navigating to specific tab, just handle notification click
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await leaveApi.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await leaveApi.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const headerActions = (
    <Space>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedRequest(null);
          setShowRequestForm(true);
        }}
      >
        Request Leave
      </Button>
    </Space>
  );

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        title="Employee Leave Management"
        subtitle="Manage your leave requests and balances"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Employee', href: '/employee' },
          { title: 'Leave Management' },
        ]}
        extraButtons={[headerActions]}
        isDarkMode={isDarkMode}
      />

      <Tabs defaultActiveKey="dashboard" activeKey={currentTab} onChange={setCurrentTab} style={{ marginBottom: 24 }}>
        <Tabs.TabPane tab="Dashboard" key="dashboard">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <StyledCard title="Leave Dashboard" isDarkMode={isDarkMode} style={{ marginBottom: '16px' }}>
                <LeaveDashboardStats stats={stats} />
              </StyledCard>
              <StyledCard title="Leave Calendar" isDarkMode={isDarkMode} style={{ marginBottom: '16px' }}>
                <LeaveCalendar requests={leaveRequests} />
              </StyledCard>
              <StyledCard title="Leave History" isDarkMode={isDarkMode}>
                <LeaveHistoryTable leaveRequests={leaveRequests} />
              </StyledCard>
            </Col>
            <Col xs={24} lg={8}>
              <StyledCard title="Leave Summary" isDarkMode={isDarkMode} style={{ marginBottom: '16px' }}>
                <LeaveSummaryPanel leaveBalances={leaveBalances} />
              </StyledCard>
              <StyledCard title="Notifications" isDarkMode={isDarkMode} style={{ marginBottom: '16px' }}>
                <LeaveNotificationPanel
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </StyledCard>
              <StyledCard title="Approval Workflow" isDarkMode={isDarkMode} style={{ marginBottom: '16px' }}>
                <LeaveApprovalWorkflow
                  pendingApprovals={leaveRequests.filter(req => req.status === 'Pending')}
                  onApprove={handleApprovalAction}
                  onReject={handleApprovalAction}
                />
              </StyledCard>
              <StyledCard title="Policy Guidelines" isDarkMode={isDarkMode}>
                <PolicyGuidelines policies={policies} />
              </StyledCard>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <LeaveRequestForm
        visible={showRequestForm}
        onCancel={() => setShowRequestForm(false)}
        onSubmit={handleLeaveRequestSubmit}
        loading={loading}
      />
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;