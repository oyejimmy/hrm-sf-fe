import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Space,
  Button,
  Badge,
  message,
  Tabs,
  Input,
  Select,
  DatePicker,
  Grid,
  Spin
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
import { useLeaves, useApproveLeave, useRejectLeave } from '../../../../hooks/api/useLeaves';
import { useTheme } from '../../../../contexts/ThemeContext';

const { TabPane } = Tabs;
const { Search: SearchInput } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const AdminCard = styled(Card)<{ $isDarkMode?: boolean }>`
  background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#d9d9d9'};
  
  .ant-card-head {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-card-head-title {
    color: ${props => props.$isDarkMode ? 'var(--text-primary)' : '#000000d9'};
  }
  
  .ant-card-body {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
`;

const FilterSection = styled.div<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
`;

const StyledTabs = styled(Tabs)<{ $isDarkMode: boolean }>`
  .ant-tabs-nav {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
  
  .ant-tabs-tab {
    color: ${props => props.$isDarkMode ? 'var(--text-secondary)' : '#000000d9'};
  }
  
  .ant-tabs-tab-active {
    color: var(--primary) !important;
  }
  
  .ant-tabs-content-holder {
    background: ${props => props.$isDarkMode ? 'var(--background)' : '#f0f2f5'};
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
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockAdminRequests);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>(mockAdminRequests);
  const [notifications, setNotifications] = useState<LeaveNotification[]>(mockAdminNotifications);
  const [stats, setStats] = useState<DashboardStats>(mockAdminStats);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  
  // API hooks
  const { data: apiLeaves, isLoading: leavesLoading, refetch } = useLeaves();
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();
  
  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = leaveRequests;
    
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(req => req.type === typeFilter);
    }
    
    setFilteredRequests(filtered);
  }, [leaveRequests, searchTerm, statusFilter, typeFilter]);

  const handleApprove = async (id: string, comments?: string) => {
    try {
      await approveMutation.mutateAsync({ id, comments });
      
      // Update local state
      setLeaveRequests(prev => prev.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: 'Approved',
              adminComments: comments,
              approvedBy: 'Current Admin',
              approvedAt: new Date().toISOString()
            }
          : req
      ));
      
      // Update stats
      setStats(prev => ({ 
        ...prev, 
        pendingRequests: prev.pendingRequests - 1,
        approvedThisMonth: prev.approvedThisMonth + 1
      }));
      
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  const handleReject = async (id: string, comments: string) => {
    try {
      await rejectMutation.mutateAsync({ id, comments });
      
      // Update local state
      setLeaveRequests(prev => prev.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: 'Rejected',
              adminComments: comments,
              rejectedBy: 'Current Admin',
              rejectedAt: new Date().toISOString()
            }
          : req
      ));
      
      // Update stats
      setStats(prev => ({ 
        ...prev, 
        pendingRequests: prev.pendingRequests - 1,
        rejectedThisMonth: prev.rejectedThisMonth + 1
      }));
      
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  const handleHold = async (id: string, comments: string) => {
    try {
      // Update local state for hold action
      setLeaveRequests(prev => prev.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: 'On Hold',
              adminComments: comments
            }
          : req
      ));
      
      message.success('Leave request put on hold successfully');
    } catch (error) {
      message.error('Failed to put leave request on hold');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange(null);
  };
  
  const exportData = () => {
    // Export functionality
    message.info('Export functionality will be implemented');
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
    <Spin spinning={leavesLoading || approveMutation.isPending || rejectMutation.isPending}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Dashboard Stats */}
        <LeaveDashboardStats stats={stats} loading={loading} />

        <StyledTabs defaultActiveKey="approvals" $isDarkMode={isDarkMode}>
          <TabPane
            tab={
              <Space>
                <Clock size={16} />
                {screens.xs ? 'Pending' : 'Pending Approvals'}
                {stats.pendingRequests > 0 && <Badge count={stats.pendingRequests} />}
              </Space>
            }
            key="approvals"
          >
            <FilterSection $isDarkMode={isDarkMode}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <SearchInput
                    placeholder="Search employee, department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <Select
                    placeholder="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All Status</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="Rejected">Rejected</Option>
                    <Option value="On Hold">On Hold</Option>
                  </Select>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <Select
                    placeholder="Type"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All Types</Option>
                    <Option value="Annual">Annual</Option>
                    <Option value="Sick">Sick</Option>
                    <Option value="Casual">Casual</Option>
                    <Option value="Maternity">Maternity</Option>
                    <Option value="Paternity">Paternity</Option>
                    <Option value="Unpaid">Unpaid</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder={['Start Date', 'End Date']}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Space>
                    <Button 
                      onClick={clearFilters}
                      disabled={!searchTerm && statusFilter === 'all' && typeFilter === 'all' && !dateRange}
                    >
                      Clear
                    </Button>
                    <Button onClick={exportData}>
                      Export
                    </Button>
                  </Space>
                </Col>
              </Row>
            </FilterSection>
            
            <AdminCard $isDarkMode={isDarkMode}>
              <LeaveApprovalTable
                requests={filteredRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onHold={handleHold}
                loading={loading || approveMutation.isPending || rejectMutation.isPending}
              />
            </AdminCard>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <Bell size={16} />
                {screens.xs ? 'Alerts' : 'Notifications'}
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
                {screens.xs ? 'All' : 'All Requests'}
              </Space>
            }
            key="all-requests"
          >
            <AdminCard title="All Leave Requests" $isDarkMode={isDarkMode}>
              <LeaveApprovalTable
                requests={leaveRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onHold={handleHold}
                loading={loading || approveMutation.isPending || rejectMutation.isPending}
              />
            </AdminCard>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <CheckCircle size={16} />
                {screens.xs ? 'Reports' : 'Reports & Analytics'}
              </Space>
            }
            key="reports"
          >
            <AdminCard title="Leave Reports & Analytics" $isDarkMode={isDarkMode}>
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                Leave reports and analytics dashboard coming soon...
              </div>
            </AdminCard>
          </TabPane>
        </StyledTabs>
      </Space>
    </Spin>
  );
};

export default LeaveApprovalDashboard;