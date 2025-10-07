import React from 'react';
import { Table, Tag, Space, Button, Avatar, Typography } from 'antd';
import { Eye, Download, Star, Lock } from 'lucide-react';
import { Document } from '../mockData';

const { Text } = Typography;

interface DocumentTableProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf': return '📄';
    case 'image': return '🖼️';
    case 'word': return '📝';
    case 'excel': return '📊';
    default: return '📁';
  }
};

const getDocumentColor = (type: string) => {
  switch (type) {
    case 'pdf': return '#f50';
    case 'image': return '#87d068';
    case 'word': return '#1890ff';
    case 'excel': return '#52c41a';
    default: return '#d4d4d4';
  }
};

export const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onViewDocument }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Document) => (
        <Space>
          <Avatar style={{ backgroundColor: getDocumentColor(record.type) }}>
            {getDocumentIcon(record.type)}
          </Avatar>
          <Text>{name}</Text>
          {record.isImportant && <Star size={14} color="#faad14" fill="#faad14" />}
          {record.isPrivate && <Lock size={14} />}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getDocumentColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Approved' ? 'green' : status === 'Pending Review' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Button
            type="text"
            icon={<Eye size={16} />}
            onClick={() => onViewDocument(record)}
          >
            View
          </Button>
          <Button type="text" icon={<Download size={16} />}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={documents}
      rowKey="id"
      pagination={{ pageSize: 7 }}
    />
  );
};