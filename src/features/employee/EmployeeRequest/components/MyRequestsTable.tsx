import React, { useState, useMemo } from 'react';
import { Table, Tag, Space, Button, Modal, Input, Empty } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';

const MyRequestsTable = ({
  requests,
  isDarkMode,
  userRole,
  onApprove,
  onReject,
  onEdit,
  onDelete
}: any) => {
  const [searchText, setSearchText] = useState('');

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'pending': return 'gold';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'in_progress': return 'blue';
      default: return 'default';
    }
  };

  const getTypeColor = (type: any) => {
    switch (type) {
      case 'loan': return 'blue';
      case 'document': return 'green';
      case 'leave': return 'orange';
      case 'equipment': return 'purple';
      case 'travel': return 'cyan';
      case 'recognition': return 'red';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string = 'medium') => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request: any) => {
      // Search filter
      const searchMatch = searchText === '' || 
        request.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        request.details.toLowerCase().includes(searchText.toLowerCase()) ||
        request.id.toLowerCase().includes(searchText.toLowerCase());

      return searchMatch;
    });
  }, [requests, searchText]);

  const columns: any = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: '40%',
      ellipsis: true,
      sorter: (a: any, b: any) => a.subject.localeCompare(b.subject),
      render: (subject: string, record: any) => (
        <div>
          <div>{subject}</div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>
            <span className="mobile-only">
              <Tag color={getTypeColor(record.type)}>
                {record.type}
              </Tag>
              <Tag color={getStatusColor(record.status)}>
                {record.status.replace('_', ' ')}
              </Tag>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      responsive: ['sm' as const],
      sorter: (a: any, b: any) => a.type.localeCompare(b.type),
      render: (type: any) => (
        <Tag color={getTypeColor(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      responsive: ['md' as const],
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      render: (status: any) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: '15%',
      responsive: ['lg' as const],
      sorter: (a: any, b: any) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
      },
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      responsive: ['lg' as const],
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },

    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              Modal.info({
                title: record.subject,
                content: (
                  <div>
                    <p><strong>Type:</strong> {record.type}</p>
                    <p><strong>Status:</strong> {record.status}</p>
                    <p><strong>Priority:</strong> {record.priority}</p>
                    <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                    {record.amount && <p><strong>Amount:</strong> ${record.amount.toLocaleString()}</p>}
                    <p><strong>Details:</strong> {record.details}</p>
                    {record.approverComments && <p><strong>Comments:</strong> {record.approverComments}</p>}
                  </div>
                ),
                width: 600,
              });
            }}
          />
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => onDelete(record.id)}
              />
            </>
          )}
          {userRole === 'manager' && record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => onApprove(record.id)}
                style={{ color: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Reject Request',
                    content: (
                      <Input.TextArea
                        placeholder="Please provide a reason for rejection"
                        rows={4}
                        style={{ marginTop: 16 }}
                      />
                    ),
                    okText: 'Reject',
                    okType: 'danger',
                    cancelText: 'Cancel',
                    onOk: (close) => {
                      const textarea = document.querySelector('.ant-modal-body textarea') as HTMLTextAreaElement;
                      onReject(record.id, textarea.value);
                      close();
                    }
                  });
                }}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search Field */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Input
          placeholder="Search requests..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="middle"
          style={{ 
            width: '100%', 
            maxWidth: 400,
            background: 'transparent',
            border: `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`,
            borderRadius: '6px',
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}
        />
      </div>

      {/* Table */}
      <div>
        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="id"
          bordered={false}
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`,
            responsive: true
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  searchText
                    ? "No requests match your search"
                    : "No requests found"
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
        
        {/* Table Message at Bottom */}
        <div style={{ 
          padding: '12px 0',
          fontSize: '12px',
          textAlign: 'left',
          color: '#666'
        }}>
          {searchText
            ? `Search "${searchText}" from ${requests.length} items showing ${filteredRequests.length} results`
            : `Showing ${filteredRequests.length} of ${requests.length} requests`
          }
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-only {
            display: inline !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyRequestsTable;