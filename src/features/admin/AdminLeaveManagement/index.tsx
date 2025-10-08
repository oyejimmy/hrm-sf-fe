import React, { useState } from 'react';
import { Card, Badge, Modal, Input, message, Row, Col, Tabs } from 'antd';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import { leaveApi } from '../../../services/api/leaveApi';
import { StateCard } from '../../../components/StateCard';
import { DATE_FORMATS } from '../../../constants/dateFormats';
import AllLeavesTable from './components/AllLeavesTable';
import PendingRequestsTable from './components/PendingRequestsTable';
import LeaveDetailsModal from './components/LeaveDetailsModal';
import { LeaveRequest, LeaveStats } from './types';
import { Container, TabContainer } from './components/styles';

const { TextArea } = Input;

const AdminLeaveManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingLeaves = [] } = useQuery({
    queryKey: ['admin-pending-leaves'],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const { data: leaveStats } = useQuery<LeaveStats>({
    queryKey: ['admin-leave-stats'],
    queryFn: leaveApi.getAdminLeaveStats,
    refetchInterval: 60000,
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => leaveApi.approveLeaveRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-stats'] });
      message.success('Leave request approved successfully');
    },
    onError: () => {
      message.error('Failed to approve leave request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) => 
      leaveApi.rejectLeaveRequest(requestId, { status: 'rejected', rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-stats'] });
      setRejectModalVisible(false);
      setRejectionReason('');
      setSelectedLeave(null);
      message.success('Leave request rejected successfully');
    },
    onError: () => {
      message.error('Failed to reject leave request');
    },
  });

  const handleApprove = (leave: LeaveRequest) => {
    Modal.confirm({
      title: 'Approve Leave Request',
      content: `Are you sure you want to approve ${leave.employeeName}'s ${leave.leaveType} leave request?`,
      onOk: () => approveMutation.mutate(leave.id.toString()),
    });
  };

  const handleReject = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedLeave || !rejectionReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({ requestId: selectedLeave.id.toString(), reason: rejectionReason });
  };

  const handleView = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setViewModalVisible(true);
  };

  const tabItems = [
    {
      key: 'all-leaves',
      label: 'All Leave Requests',
      children: (
        <Card>
          <AllLeavesTable
            onViewDetails={handleView}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </Card>
      ),
    },
    {
      key: 'pending-only',
      label: (
        <span>
          Pending Requests
          <Badge count={pendingLeaves.length} style={{ marginLeft: 8 }} />
        </span>
      ),
      children: (
        <Card>
          <PendingRequestsTable
            onViewDetails={handleView}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </Card>
      ),
    },
  ];

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Leave Management System"
        subtitle="Manage employee leave requests, approvals, and leave policies"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Leave Management' }
        ]}
      />

      {leaveStats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Pending Requests" value={leaveStats.pendingRequests || 0} icon={<Clock />} tone="lightPeach" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Approved This Month" value={leaveStats.approvedThisMonth || 0} icon={<CheckCircle />} tone="pastelGreen" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Rejected Requests" value={leaveStats.rejectedRequests || 0} icon={<XCircle />} tone="pastelPink" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Total Requests" value={leaveStats.totalRequests || 0} icon={<User />} tone="pastelBlue" />
          </Col>
        </Row>
      )}

      <Container>
        <TabContainer>
          <Tabs defaultActiveKey="all-leaves" items={tabItems} />
        </TabContainer>
      </Container>

      <Modal 
        title="Reject Leave Request" 
        open={rejectModalVisible} 
        onOk={handleRejectConfirm} 
        onCancel={() => { 
          setRejectModalVisible(false); 
          setRejectionReason(''); 
          setSelectedLeave(null); 
        }} 
        confirmLoading={rejectMutation.isPending}
      >
        {selectedLeave && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
            <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
            <p><strong>Duration:</strong> {dayjs(selectedLeave.startDate).format(DATE_FORMATS.DISPLAY)} - {dayjs(selectedLeave.endDate).format(DATE_FORMATS.DISPLAY)}</p>
          </div>
        )}
        <TextArea 
          placeholder="Please provide a reason for rejection..." 
          value={rejectionReason} 
          onChange={(e) => setRejectionReason(e.target.value)} 
          rows={4} 
        />
      </Modal>

      <LeaveDetailsModal
        visible={viewModalVisible}
        leave={selectedLeave}
        onClose={() => { setViewModalVisible(false); setSelectedLeave(null); }}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={approveMutation.isPending}
      />
    </Wrapper>
  );
};

export default AdminLeaveManagement;