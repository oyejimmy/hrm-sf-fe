import React from 'react';
import { Table, Tag, Space } from 'antd';

interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: string;
  date: string;
  priority: string;
}

interface ComplaintHistoryTableProps {
  complaints: Complaint[];
  onViewDetails: (complaintId: string) => void;
}

const ComplaintHistoryTable: React.FC<ComplaintHistoryTableProps> = ({ complaints, onViewDetails }) => {
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'geekblue';
        if (status === 'Pending') {
          color = 'volcano';
        } else if (status === 'Resolved') {
          color = 'green';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'default';
        if (priority === 'high') {
          color = 'red';
        } else if (priority === 'medium') {
          color = 'orange';
        } else if (priority === 'low') {
          color = 'blue';
        }
        return (
          <Tag color={color} key={priority}>
            {priority.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Complaint) => (
        <Space size="middle">
          <a onClick={() => onViewDetails(record.id)}>View Details</a>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={complaints} rowKey="id" />;
};

export default ComplaintHistoryTable;