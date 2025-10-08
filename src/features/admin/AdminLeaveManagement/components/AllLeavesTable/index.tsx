import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Tooltip, Input } from 'antd';
import { Eye, CheckCircle, XCircle, Clock, Search, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { leaveApi } from '../../../../../services/api/leaveApi';
import StatusIndicator from '../StatusIndicator';
import { AllLeavesTableProps, LeaveRequest } from '../../types';
import { 
  FiltersContainer, 
  EmptyState, 
  EmptyStateTitle, 
  EmptyStateIcon,
  TableRowStyles 
} from '../styles';

const AllLeavesTable: React.FC<AllLeavesTableProps> = ({ onViewDetails, onApprove, onReject }) => {
  const [searchText, setSearchText] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: allLeaves = [], isLoading } = useQuery({
    queryKey: ['all-leaves'],
    queryFn: () => leaveApi.getAllLeaveRequests({}),
    refetchInterval: 10000,
  });

  useEffect(() => {
    setLastUpdate(new Date());
  }, [allLeaves]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'orange', approved: 'green', rejected: 'red', cancelled: 'gray', 'on hold': 'purple'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  const getLeaveTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      annual: 'blue', sick: 'red', casual: 'green', maternity: 'purple', paternity: 'orange', unpaid: 'gray'
    };
    return colors[(type || '').toLowerCase()] || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle size={14} />;
      case 'rejected': return <XCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      default: return null;
    }
  };

  const filteredData = allLeaves.filter((leave: LeaveRequest) => {
    const matchesSearch = 
      (leave.employeeName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (leave.employeeId || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (leave.reason || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (leave.department || '').toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      width: 200,
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.employeeName.localeCompare(b.employeeName),
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500, color: '#262626' }}>{record.employeeName}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.employeeId}</span>
          {record.department && (
            <span style={{ fontSize: '11px', color: '#666' }}>{record.department}</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      width: 120,
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.leaveType.localeCompare(b.leaveType),
      render: (type: string) => (
        <Tag color={getLeaveTypeColor(type)} style={{ margin: 0, fontWeight: 500 }}>{type}</Tag>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 180,
      sorter: (a: LeaveRequest, b: LeaveRequest) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '13px', color: '#262626' }}>
            {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD, YYYY')}
          </span>
          <span style={{ fontSize: '12px', color: '#1890ff', fontWeight: 500 }}>
            {record.daysRequested} day{record.daysRequested !== 1 ? 's' : ''}
          </span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.status.localeCompare(b.status),
      render: (status: string, record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <Tag 
            color={getStatusColor(status)} 
            icon={getStatusIcon(status)}
            style={{ margin: 0, display: 'flex', alignItems: 'center', width: 'fit-content', fontWeight: 500 }}
          >
            {status.toUpperCase()}
          </Tag>
          {record.updatedAt && (
            <span style={{ fontSize: '10px', color: '#8c8c8c' }}>
              Updated: {dayjs(record.updatedAt).format('MMM DD, HH:mm')}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: 'Applied',
      dataIndex: 'createdAt',
      width: 100,
      sorter: (a: LeaveRequest, b: LeaveRequest) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '13px', color: '#262626' }}>{dayjs(date).format('MMM DD')}</span>
          <span style={{ fontSize: '11px', color: '#8c8c8c' }}>{dayjs(date).format('YYYY')}</span>
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      width: 200,
      render: (reason: string) => (
        <Tooltip title={reason || 'No reason provided'}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#595959'
          }}>
            {reason || 'No reason provided'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (record: LeaveRequest) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<Eye size={16} />} onClick={() => onViewDetails(record)} style={{ color: '#595959' }} />
          </Tooltip>
          {record.status.toLowerCase() === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircle size={16} />} 
                  style={{ color: '#52c41a' }}
                  onClick={() => onApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<XCircle size={16} />} 
                  style={{ color: '#ff4d4f' }}
                  onClick={() => onReject(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <FiltersContainer>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, color: '#595959', fontSize: '16px', fontWeight: 500 }}>
            All Employee Leave Requests
          </h3>
          <Space>
            <Input
              placeholder="Search employees, ID, reason..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <StatusIndicator isOnline={true} lastUpdate={lastUpdate} isLoading={isLoading} />
          </Space>
        </Space>
      </FiltersContainer>

      {filteredData.length === 0 && !isLoading ? (
        <EmptyState>
          <EmptyStateIcon>
            <List size={48} />
          </EmptyStateIcon>
          <EmptyStateTitle>No Leave Requests Found</EmptyStateTitle>
          <p>There are currently no leave requests matching your criteria.</p>
        </EmptyState>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leave requests`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
          style={{ backgroundColor: '#fff' }}
        />
      )}


    </div>
  );
};

export default AllLeavesTable;