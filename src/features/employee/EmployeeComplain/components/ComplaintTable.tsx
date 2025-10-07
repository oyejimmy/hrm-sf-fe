import React from 'react';
import { Table, Tag, Button, Space, Typography } from 'antd';
import { Eye } from 'lucide-react';
import { Complaint } from '../mockData';

const { Text } = Typography;

interface ComplaintTableProps {
  complaints: Complaint[];
  onViewComplaint: (complaint: Complaint) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints, onViewComplaint }) => {
  const getStatusTag = (status: string) => {
    const colors = {
      'Pending': 'orange',
      'In Progress': 'blue',
      'Resolved': 'green',
      'Rejected': 'red'
    };
    return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const colors = {
      'Low': 'green',
      'Medium': 'blue',
      'High': 'red'
    };
    return <Tag color={colors[priority as keyof typeof colors]}>{priority}</Tag>;
  };

  const columns: any = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) => <Text strong ellipsis>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['sm'],
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: getPriorityTag,
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (text: string) => text || '-',
      responsive: ['lg'],
    },
    {
      title: 'Date',
      dataIndex: 'dateSubmitted',
      key: 'dateSubmitted',
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Complaint) => (
        <Button
          type="text"
          icon={<Eye size={16} />}
          onClick={() => onViewComplaint(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={complaints}
      rowKey="id"
      pagination={{ pageSize: 8, responsive: true }}
      scroll={{ x: 800 }}
    />
  );
};