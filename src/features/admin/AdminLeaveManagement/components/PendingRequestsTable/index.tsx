import React, { useState } from 'react';
import { Table, Tag, Button, Space, Tooltip, Input } from 'antd';
import { Eye, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { message } from 'antd';
import { leaveApi } from '../../../../../services/api/leaveApi';
import { DATE_FORMATS } from '../../../../../constants/dateFormats';
import { LeaveRequest } from '../../types';
import { SearchContainer, EmptyState, EmptyStateTitle, EmptyStateIcon } from '../styles';

interface PendingRequestsTableProps {
  onViewDetails: (leave: LeaveRequest) => void;
  onApprove: (leave: LeaveRequest) => void;
  onReject: (leave: LeaveRequest) => void;
}

const PendingRequestsTable: React.FC<PendingRequestsTableProps> = ({ onViewDetails, onApprove, onReject }) => {
  const [searchText, setSearchText] = useState('');
  const [expandedReasons, setExpandedReasons] = useState<{[key: string]: boolean}>({});
  const queryClient = useQueryClient();

  const { data: pendingLeaves = [], isLoading } = useQuery({
    queryKey: ['admin-pending-leaves'],
    queryFn: leaveApi.getPendingLeaveRequests,
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => leaveApi.approveLeaveRequest(requestId),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ['admin-pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leave-stats'] });
      message.success('Leave request rejected successfully');
    },
    onError: () => {
      message.error('Failed to reject leave request');
    },
  });

  const getLeaveTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      annual: 'blue', sick: 'red', casual: 'green', maternity: 'purple', paternity: 'orange', unpaid: 'gray'
    };
    return colors[(type || '').toLowerCase()] || 'default';
  };

  const filteredData = pendingLeaves.filter((leave: LeaveRequest) => {
    const matchesSearch = 
      (leave.employeeName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (leave.employeeId || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (leave.reason || '').toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.employeeName.localeCompare(b.employeeName),
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500, color: '#262626' }}>{record.employeeName}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.employeeId}</span>
          {record.position && (
            <span style={{ fontSize: '11px', color: '#666' }}>{record.position}</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.leaveType.localeCompare(b.leaveType),
      render: (type: string) => <Tag color={getLeaveTypeColor(type)} style={{ fontWeight: 500 }}>{type}</Tag>,
    },
    {
      title: 'Duration',
      key: 'duration',
      sorter: (a: LeaveRequest, b: LeaveRequest) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      render: (record: LeaveRequest) => (
        <span style={{ color: '#262626' }}>{dayjs(record.startDate).format(DATE_FORMATS.DISPLAY)} - {dayjs(record.endDate).format(DATE_FORMATS.DISPLAY)}</span>
      ),
    },
    {
      title: 'Days',
      dataIndex: 'days_requested',
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.days_requested - b.days_requested,
      render: (days: number, record: LeaveRequest) => {
        const dayCount = days || record.days_requested || (record as any).daysRequested || 0;
        return (
          <span style={{ fontSize: '14px', color: '#1890ff', fontWeight: 500 }}>{dayCount} day{dayCount !== 1 ? 's' : ''}</span>
        );
      },
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
            <span style={{ color: '#595959' }}>
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
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'} style={{ fontWeight: 500 }}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      sorter: (a: LeaveRequest, b: LeaveRequest) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => <span style={{ color: '#262626' }}>{dayjs(date).format(DATE_FORMATS.DISPLAY)}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LeaveRequest) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<Eye size={16} />} onClick={() => onViewDetails(record)} style={{ color: '#595959' }} />
          </Tooltip>
          <Tooltip title="Approve">
            <Button 
              type="text" 
              icon={<CheckCircle size={16} />} 
              style={{ color: '#52c41a' }} 
              onClick={() => onApprove(record)} 
              loading={approveMutation.isPending} 
            />
          </Tooltip>
          <Tooltip title="Reject">
            <Button 
              type="text" 
              icon={<XCircle size={16} />} 
              style={{ color: '#ff4d4f' }} 
              onClick={() => onReject(record)} 
              loading={rejectMutation.isPending} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading leave data...</div>;

  if (pendingLeaves.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <Clock size={48} />
        </EmptyStateIcon>
        <EmptyStateTitle>No Pending Requests</EmptyStateTitle>
        <p>There are currently no pending leave requests to review.</p>
      </EmptyState>
    );
  }

  return (
    <div>
      <Table
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Pending Leave Requests</h3>
            <Input
              placeholder="Search..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
          </div>
        )} 
        columns={columns} 
        dataSource={filteredData} 
        loading={isLoading} 
        rowKey="id" 
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} requests` }} 
        scroll={{ x: true }}
        size="middle"
        style={{ backgroundColor: '#fff' }}
      />
    </div>
  );
};

export default PendingRequestsTable;