import React from 'react';
import { Table, Button, Tag, Space, Typography } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Star } from 'lucide-react';
import { PerformanceReview, PerformanceTableProps } from '../types';

const { Text } = Typography;

// Status colors and icons
const statusColors: Record<string, string> = {
  Draft: 'default',
  Submitted: 'blue',
  Approved: 'green',
  Completed: 'purple'
};

const statusIcons: Record<string, React.ReactNode> = {
  Draft: <CalendarOutlined />,
  Submitted: <EditOutlined />,
  Approved: <EyeOutlined />,
  Completed: <EyeOutlined />
};

const PerformanceTable: React.FC<PerformanceTableProps> = ({
  reviews,
  onViewReview,
  onEditReview,
  onDeleteReview
}) => {
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string, record: PerformanceReview) => (
        <Space>
          <UserOutlined style={{ color: '#3b82f6' }} />
          <div>
            <div>{text}</div>
            <Text type="secondary">{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#8b5cf6' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Review Period',
      dataIndex: 'reviewPeriod',
      key: 'reviewPeriod',
      render: (text: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#10b981' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating: number) => (
        <Space>
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Text strong>{rating}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag icon={statusIcons[status]} color={statusColors[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PerformanceReview) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewReview(record)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditReview(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteReview(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reviews}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default PerformanceTable;