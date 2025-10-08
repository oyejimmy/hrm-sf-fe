import React, { useState } from 'react';
import { Card, Badge, Table, Button, Space, Tag, Modal, Input, message, Tooltip, Row, Col, Dropdown } from 'antd';
import { Calendar, CheckCircle, XCircle, Eye, User, Clock, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import { leaveApi } from '../../../services/api/leaveApi';
import { StateCard } from '../../../components/StateCard';
import { DATE_FORMATS } from '../../../constants/dateFormats';

const { TextArea } = Input;

interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  department?: string;
  position?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: string;
  createdAt: string;
  approverComments?: string;
  approvedBy?: string;
  approvedAt?: string;
}

const LeaveManagementPanel: React.FC = () => {
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedReasons, setExpandedReasons] = useState<{[key: string]: boolean}>({});
  const queryClient = useQueryClient();

  const { data: pendingLeaves = [], isLoading } = useQuery({
    queryKey: ['admin-pending-leaves'],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const { data: leaveStats } = useQuery({
    queryKey: ['admin-leave-stats'],
    queryFn: leaveApi.getAdminLeaveStats,
    refetchInterval: 60000,
  });

  const { data: leaveNotifications = [] } = useQuery({
    queryKey: ['admin-leave-notifications'],
    queryFn: leaveApi.getAdminLeaveNotifications,
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => leaveApi.approveLeaveRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-stats'] });
      message.success('Leave request approved successfully');
    },
    onError: (error: any) => {
      console.error('Approve error:', error);
      message.error('Failed to approve leave request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) => 
      leaveApi.rejectLeaveRequest(requestId, { status: 'rejected', rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-stats'] });
      setRejectModalVisible(false);
      setRejectionReason('');
      setSelectedLeave(null);
      message.success('Leave request rejected successfully');
    },
    onError: (error: any) => {
      console.error('Reject error:', error);
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

  const getLeaveTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      annual: 'blue', sick: 'red', casual: 'green', maternity: 'purple', paternity: 'orange', unpaid: 'gray'
    };
    return colors[type.toLowerCase()] || 'default';
  };

  const filteredData = pendingLeaves.filter((leave: LeaveRequest) => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterType === 'all' || leave.leaveType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{record.employeeName}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.employeeId}</span>
        </Space>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      render: (type: string) => <Tag color={getLeaveTypeColor(type)}>{type}</Tag>,
      filters: [
        { text: 'Annual', value: 'annual' },
        { text: 'Sick', value: 'sick' },
        { text: 'Casual', value: 'casual' },
        { text: 'Maternity', value: 'maternity' },
        { text: 'Paternity', value: 'paternity' },
      ],
      onFilter: (value: any, record: LeaveRequest) => record.leaveType.toLowerCase() === value.toLowerCase(),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span>{dayjs(record.startDate).format(DATE_FORMATS.DISPLAY)} - {dayjs(record.endDate).format(DATE_FORMATS.DISPLAY)}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.daysRequested} day{record.daysRequested !== 1 ? 's' : ''}</span>
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      render: (reason: string, record: LeaveRequest) => {
        const text = reason || 'No reason provided';
        const isLong = text.length > 50;
        const key = `reason-${record.id}`;
        const isExpanded = expandedReasons[key];
        
        return (
          <div style={{ maxWidth: '200px' }}>
            <span>
              {isExpanded || !isLong ? text : `${text.substring(0, 50)}...`}
            </span>
            {isLong && (
              <Button 
                type="link" 
                size="small" 
                style={{ padding: 0, marginLeft: 4, fontSize: '12px' }}
                onClick={() => setExpandedReasons(prev => ({ ...prev, [key]: !prev[key] }))}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      render: (date: string) => dayjs(date).format(DATE_FORMATS.DISPLAY),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LeaveRequest) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<Eye size={16} />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Approve">
            <Button type="text" icon={<CheckCircle size={16} />} style={{ color: '#52c41a' }} 
              onClick={() => handleApprove(record)} loading={approveMutation.isPending} />
          </Tooltip>
          <Tooltip title="Reject">
            <Button type="text" icon={<XCircle size={16} />} style={{ color: '#ff4d4f' }} 
              onClick={() => handleReject(record)} loading={rejectMutation.isPending} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading leave data...</div>;

  return (
    <div>
      <div style={{ 
        padding: '16px 0', 
        marginBottom: '16px'
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space wrap>
              <Dropdown
                menu={{
                  items: [
                    { key: 'all', label: 'All Types' },
                    { key: 'annual', label: 'Annual Leave' },
                    { key: 'sick', label: 'Sick Leave' },
                    { key: 'casual', label: 'Casual Leave' },
                    { key: 'maternity', label: 'Maternity Leave' },
                    { key: 'paternity', label: 'Paternity Leave' }
                  ],
                  onClick: ({ key }) => setFilterType(key)
                }}
                trigger={['click']}
              >
                <Button style={{ color: '#1890ff', border: 'none', boxShadow: 'none' }}>
                  Leave Type <span style={{ marginLeft: 4 }}>▼</span>
                </Button>
              </Dropdown>
              {filterType !== 'all' && (
                <Tag 
                  closable 
                  onClose={() => setFilterType('all')}
                  color="blue"
                >
                  {filterType === 'annual' ? 'Annual Leave' :
                   filterType === 'sick' ? 'Sick Leave' :
                   filterType === 'casual' ? 'Casual Leave' :
                   filterType === 'maternity' ? 'Maternity Leave' :
                   filterType === 'paternity' ? 'Paternity Leave' : filterType}
                </Tag>
              )}
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by employee name, ID, or reason..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </div>
      <Table columns={columns} dataSource={filteredData} loading={isLoading} rowKey="id" 
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} requests` }} 
        scroll={{ x: true }} />

      {/* Reject Modal */}
      <Modal title="Reject Leave Request" open={rejectModalVisible} onOk={handleRejectConfirm} 
        onCancel={() => { setRejectModalVisible(false); setRejectionReason(''); setSelectedLeave(null); }} 
        confirmLoading={rejectMutation.isPending}>
        {selectedLeave && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
            <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
            <p><strong>Duration:</strong> {dayjs(selectedLeave.startDate).format(DATE_FORMATS.DISPLAY)} - {dayjs(selectedLeave.endDate).format(DATE_FORMATS.DISPLAY)}</p>
          </div>
        )}
        <TextArea placeholder="Please provide a reason for rejection..." value={rejectionReason} 
          onChange={(e) => setRejectionReason(e.target.value)} rows={4} />
      </Modal>

      {/* View Details Modal */}
      <Modal 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={20} />
            <span>Leave Request Details</span>
            {selectedLeave && (
              <Tag color={selectedLeave.status === 'pending' ? 'orange' : selectedLeave.status === 'approved' ? 'green' : 'red'}>
                {selectedLeave.status.toUpperCase()}
              </Tag>
            )}
          </div>
        }
        open={viewModalVisible} 
        onCancel={() => { setViewModalVisible(false); setSelectedLeave(null); }}
        width={700}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>Close</Button>,
          selectedLeave?.status === 'pending' && [
            <Button key="approve" type="primary" icon={<CheckCircle size={16} />} 
              onClick={() => { if (selectedLeave) { handleApprove(selectedLeave); setViewModalVisible(false); } }} 
              loading={approveMutation.isPending}>Approve</Button>,
            <Button key="reject" danger icon={<XCircle size={16} />} 
              onClick={() => { setViewModalVisible(false); if (selectedLeave) handleReject(selectedLeave); }}>Reject</Button>
          ]
        ].flat().filter(Boolean)}>
        {selectedLeave && (
          <div style={{ padding: '8px 0' }}>
            {/* Employee Information Section */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1890ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Employee Information
              </h4>
              <Row gutter={[24, 12]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{selectedLeave.employeeName}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Employee ID</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{selectedLeave.employeeId}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{selectedLeave.department || 'Not specified'}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Position</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{selectedLeave.position || 'Not specified'}</div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Leave Details Section */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#52c41a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> Leave Details
              </h4>
              <Row gutter={[24, 12]}>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leave Type</span>
                    <div><Tag color={getLeaveTypeColor(selectedLeave.leaveType)} style={{ margin: 0 }}>{selectedLeave.leaveType}</Tag></div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                    <div>
                      <Tag color={selectedLeave.status === 'pending' ? 'orange' : selectedLeave.status === 'approved' ? 'green' : 'red'} style={{ margin: 0 }}>
                        {selectedLeave.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start Date</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{dayjs(selectedLeave.startDate).format(DATE_FORMATS.DISPLAY)}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End Date</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{dayjs(selectedLeave.endDate).format(DATE_FORMATS.DISPLAY)}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</span>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#1890ff' }}>
                      {selectedLeave.daysRequested} {selectedLeave.daysRequested === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Applied On</span>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{dayjs(selectedLeave.createdAt).format(DATE_FORMATS.DISPLAY)}</div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Reason Section */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#595959' }}>Reason for Leave</h4>
              <div style={{ 
                padding: '12px 16px', 
                background: '#fff', 
                borderRadius: '6px', 
                border: '1px solid #d9d9d9',
                minHeight: '60px',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {selectedLeave.reason || 'No reason provided'}
              </div>
            </div>

            {/* Approver Comments Section */}
            {(selectedLeave.approverComments || selectedLeave.status !== 'pending') && (
              <div style={{ marginBottom: '16px', padding: '16px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#d46b08' }}>Approver Comments</h4>
                {selectedLeave.approverComments ? (
                  <div style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
                    {selectedLeave.approverComments}
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: '#8c8c8c', fontStyle: 'italic' }}>
                    No comments provided
                  </div>
                )}
                {selectedLeave.approvedBy && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    <strong>Reviewed by:</strong> {selectedLeave.approvedBy} 
                    {selectedLeave.approvedAt && (
                      <span> on {dayjs(selectedLeave.approvedAt).format(DATE_FORMATS.DISPLAY)}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const AdminLeaveManagement: React.FC = () => {
  const { isDarkMode } = useTheme();

  const { data: pendingLeaves = [] } = useQuery({
    queryKey: ['admin-pending-leaves'],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const { data: leaveStats } = useQuery({
    queryKey: ['admin-leave-stats'],
    queryFn: leaveApi.getAdminLeaveStats,
    refetchInterval: 60000,
  });

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

      {/* Stats Cards Outside */}
      {leaveStats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Pending Requests" value={leaveStats.pendingRequests} icon={<Clock />} tone="lightPeach" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Approved This Month" value={leaveStats.approvedThisMonth} icon={<CheckCircle />} tone="pastelGreen" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Rejected Requests" value={leaveStats.rejectedRequests} icon={<XCircle />} tone="pastelPink" />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StateCard label="Total Requests" value={leaveStats.totalRequests} icon={<User />} tone="pastelBlue" />
          </Col>
        </Row>
      )}

      <Card 
        title='Leave Management System'
      >
        <LeaveManagementPanel />
      </Card>
    </Wrapper>
  );
};

export default AdminLeaveManagement;