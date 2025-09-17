import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Avatar } from 'antd';
import { Eye, Download, MessageSquare, User } from 'lucide-react';
import { LeaveRequest } from '../types';

interface LeaveHistoryTableProps {
  leaveRequests: LeaveRequest[];
  loading?: boolean;
}

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({
  leaveRequests,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      case 'On Hold': return 'orange';
      case 'Pending': return 'blue';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span>{record.duration} day{record.duration !== 1 ? 's' : ''}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {record.durationType}
          </span>
        </Space>
      )
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (record: LeaveRequest) => (
        <Space direction="vertical" size={0}>
          <span>{new Date(record.from).toLocaleDateString()}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            to {new Date(record.to).toLocaleDateString()}
          </span>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: 'Recipients',
      key: 'recipients',
      render: (record: LeaveRequest) => (
        <Avatar.Group maxCount={3} size="small">
          {record.recipientDetails.map(recipient => (
            <Tooltip key={recipient.id} title={`${recipient.name} - ${recipient.role}`}>
              <Avatar size="small" icon={<User size={12} />} />
            </Tooltip>
          ))}
        </Avatar.Group>
      )
    },
    {
      title: 'Applied',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LeaveRequest) => (
        <Space>
          <Button size="small" icon={<Eye size={14} />} />
          {record.attachmentUrl && (
            <Button size="small" icon={<Download size={14} />} />
          )}
          {record.adminComments && (
            <Tooltip title={record.adminComments}>
              <Button size="small" icon={<MessageSquare size={14} />} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={leaveRequests}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};

export default LeaveHistoryTable;