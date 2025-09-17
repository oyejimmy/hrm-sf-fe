import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Space,
  Button,
  Badge,
  message,
  Tabs
} from 'antd';
import { Bell, Users, Clock, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import LeaveNotificationPanel from '../../../employee/EmployeeLeaveManagement/components/LeaveNotificationPanel';
import LeaveDashboardStats from '../../../employee/EmployeeLeaveManagement/components/LeaveDashboardStats';
import LeaveApprovalTable from './LeaveApprovalTable';
import { 
  LeaveNotification, 
  DashboardStats, 
  LeaveApprovalRequest 
} from '../../../employee/EmployeeLeaveManagement/types';
import { LeaveRequest } from '../types';
import { leaveApi } from '../../../../services/api/leaveApi';

const { TabPane } = Tabs;

const AdminCard = styled(Card)`
  .ant-card-head-title {
    color: var(--text-color);
  }
`;

// Mock data for admin view
const mockAdminRequests: LeaveRequest[] = [
  {
    id: '1',
    employee: 'John Doe',
    employeeId: 'emp1',
    department: 'Engineering',
    type: 'Annual',
    fromDate: '2024-01-15',
    toDate: '2024-01-20',
    duration: '5 days',
    reason: 'Family vacation - visiting parents overseas',
    status: 'Pending'
  },
  {
    id: '2',
    employee: 'Jane Smith',
    employeeId: 'emp2',
    department: 'Marketing',
    type: 'Sick',
    fromDate: '2024-01-12',
    toDate: '2024-01-14',
    duration: '3 days',
    reason: 'Medical treatment and recovery',
    status: 'Pending'
  }
];

const mockAdminNotifications: LeaveNotification[] = [
  {
    id: '1',
    type: 'leave_request',
    message: 'John Doe submitted a new leave request for annual leave (5 days)',
    leaveRequestId: '1',
    fromEmployee: 'John Doe',
    timestamp: '2 hours ago',
    read: false,
    priority: 'medium'
  },
  {
    id: '2',
    type: 'leave_request',
    message: 'Jane Smith submitted a sick leave request (3 days)',
    leaveRequestId: '2',
    fromEmployee: 'Jane Smith',
    timestamp: '4 hours ago',
    read: false,
    priority: 'high'
  }
];

const mockAdminStats: DashboardStats = {
  pendingRequests: 8,
  approvedThisMonth: 25,
  rejectedThisMonth: 3,
  onLeaveToday: 12
};

const LeaveApprovalDashboard: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockAdminRequests);
  const [notifications, setNotifications] = useState<LeaveNotification[]>(mockAdminNotifications);
  const [stats, setStats] = useState<DashboardStats>(mockAdminStats);
  const [loading, setLoading] = useState(false);

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
              adminComments: approval.comments,
              approvedBy: approval.action === 'approve' ? 'Current Admin' : undefined,
              approvedAt: approval.action === 'approve' ? new Date().toISOString() : undefined,
              rejectedBy: approval.action === 'reject' ? 'Current Admin' : undefined,
              rejectedAt: approval.action === 'reject' ? new Date().toISOString() : undefined
            }
          : req
      ));

      // Send notification email to employee
      const request = leaveRequests.find(r => r.id === approval.requestId);
      if (request) {
        await leaveApi.sendLeaveNotificationEmail({
          requestId: approval.requestId,
          recipientIds: [request.employeeId || request.employee],
          type: approval.action === 'approve' ? 'approval' : 
               approval.action === 'reject' ? 'rejection' : 
               approval.action === 'hold' ? 'hold' : 'details_request'
        });
      }

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

      const actionText = approval.action === 'approve' ? 'approved' :
                        approval.action === 'reject' ? 'rejected' :
                        approval.action === 'hold' ? 'placed on hold' :
                        'updated with additional details request';

      message.success(`Leave request ${actionText} successfully. Employee has been notified.`);
    } catch (error) {
      message.error('Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: LeaveNotification) => {
    // Mark as read and potentially navigate to specific request
    handleMarkAsRead(notification.id);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Dashboard Stats */}
      <LeaveDashboardStats stats={stats} loading={loading} />

      <Tabs defaultActiveKey="approvals">
        <TabPane
          tab={
            <Space>
              <Clock size={16} />
              Pending Approvals
              {stats.pendingRequests > 0 && <Badge count={stats.pendingRequests} />}
            </Space>
          }
          key="approvals"
        >
          <LeaveApprovalTable
            requests={leaveRequests}
            onApprove={(id) => handleApprovalAction({ requestId: id, action: 'approve', comments: '' })}
            onReject={(id) => handleApprovalAction({ requestId: id, action: 'reject', comments: '' })}
            loading={loading}
          />
        </TabPane>

        <TabPane
          tab={
            <Space>
              <Bell size={16} />
              Notifications
              {unreadCount > 0 && <Badge count={unreadCount} />}
            </Space>
          }
          key="notifications"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <LeaveNotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationClick={handleNotificationClick}
              />
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <Space>
              <Users size={16} />
              All Requests
            </Space>
          }
          key="all-requests"
        >
          <AdminCard title="All Leave Requests">
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              All leave requests table would go here
            </div>
          </AdminCard>
        </TabPane>

        <TabPane
          tab={
            <Space>
              <CheckCircle size={16} />
              Reports
            </Space>
          }
          key="reports"
        >
          <AdminCard title="Leave Reports & Analytics">
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              Leave reports and analytics would go here
            </div>
          </AdminCard>
        </TabPane>
      </Tabs>
    </Space>
  );
};

export default LeaveApprovalDashboard;