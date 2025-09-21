import React, { useState, useMemo } from 'react';
import { Table, Tag, Space, Button, Modal, Input, Dropdown, MenuProps, Empty } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
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
  const [selectedStatus, setSelectedStatus] = useState<any | 'all'>('all');
  const [selectedType, setSelectedType] = useState<any | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<string | 'all'>('all');

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
      // Status filter
      const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
      
      // Type filter
      const typeMatch = selectedType === 'all' || request.type === selectedType;
      
      // Priority filter
      const priorityMatch = selectedPriority === 'all' || request.priority === selectedPriority;
      
      // Search filter
      const searchMatch = searchText === '' || 
        request.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        request.details.toLowerCase().includes(searchText.toLowerCase()) ||
        request.id.toLowerCase().includes(searchText.toLowerCase());

      return statusMatch && typeMatch && priorityMatch && searchMatch;
    });
  }, [requests, searchText, selectedStatus, selectedType, selectedPriority]);

  const statusItems: MenuProps['items'] = [
    {
      key: 'all',
      label: 'All Statuses',
      onClick: () => setSelectedStatus('all')
    },
    {
      key: 'pending',
      label: 'Pending',
      onClick: () => setSelectedStatus('pending')
    },
    {
      key: 'approved',
      label: 'Approved',
      onClick: () => setSelectedStatus('approved')
    },
    {
      key: 'rejected',
      label: 'Rejected',
      onClick: () => setSelectedStatus('rejected')
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      onClick: () => setSelectedStatus('in_progress')
    }
  ];

  const typeItems: MenuProps['items'] = [
    {
      key: 'all',
      label: 'All Types',
      onClick: () => setSelectedType('all')
    },
    {
      key: 'loan',
      label: 'Loan',
      onClick: () => setSelectedType('loan')
    },
    {
      key: 'document',
      label: 'Document',
      onClick: () => setSelectedType('document')
    },
    {
      key: 'leave',
      label: 'Leave',
      onClick: () => setSelectedType('leave')
    },
    {
      key: 'equipment',
      label: 'Equipment',
      onClick: () => setSelectedType('equipment')
    },
    {
      key: 'travel',
      label: 'Travel',
      onClick: () => setSelectedType('travel')
    },
    {
      key: 'recognition',
      label: 'Recognition',
      onClick: () => setSelectedType('recognition')
    }
  ];

  const priorityItems: MenuProps['items'] = [
    {
      key: 'all',
      label: 'All Priorities',
      onClick: () => setSelectedPriority('all')
    },
    {
      key: 'high',
      label: 'High',
      onClick: () => setSelectedPriority('high')
    },
    {
      key: 'medium',
      label: 'Medium',
      onClick: () => setSelectedPriority('medium')
    },
    {
      key: 'low',
      label: 'Low',
      onClick: () => setSelectedPriority('low')
    }
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <span style={{ fontWeight: 'bold' }}>#{id}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: any) => (
        <Tag color={getTypeColor(type)} style={{ textTransform: 'capitalize' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: any) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)} style={{ textTransform: 'capitalize' }}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      render: (details: string) => (
        <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)' }}>
          {details}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => Modal.info({
              title: `Request Details - ${record.subject}`,
              content: (
                <div>
                  <p><strong>Type:</strong> {record.type}</p>
                  <p><strong>Status:</strong> {record.status}</p>
                  <p><strong>Priority:</strong> {record.priority}</p>
                  <p><strong>Date:</strong> {record.date}</p>
                  <p><strong>Details:</strong> {record.details}</p>
                  {record.approver && <p><strong>Approver:</strong> {record.approver}</p>}
                  {record.approverComments && <p><strong>Comments:</strong> {record.approverComments}</p>}
                </div>
              ),
              width: 600,
            })}
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
      {/* Search and Filter Controls */}
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        gap: 12, 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search Input */}
        <Input
          placeholder="Search requests..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />

        {/* Status Filter Dropdown */}
        <Dropdown menu={{ items: statusItems }} trigger={['click']}>
          <Button icon={<FilterOutlined />}>
            Status: {selectedStatus === 'all' ? 'All' : selectedStatus.replace('_', ' ')}
          </Button>
        </Dropdown>

        {/* Type Filter Dropdown */}
        <Dropdown menu={{ items: typeItems }} trigger={['click']}>
          <Button icon={<FilterOutlined />}>
            Type: {selectedType === 'all' ? 'All' : selectedType}
          </Button>
        </Dropdown>

        {/* Priority Filter Dropdown */}
        <Dropdown menu={{ items: priorityItems }} trigger={['click']}>
          <Button icon={<FilterOutlined />}>
            Priority: {selectedPriority === 'all' ? 'All' : selectedPriority}
          </Button>
        </Dropdown>

        {/* Clear Filters Button */}
        {(selectedStatus !== 'all' || selectedType !== 'all' || selectedPriority !== 'all' || searchText) && (
          <Button 
            onClick={() => {
              setSelectedStatus('all');
              setSelectedType('all');
              setSelectedPriority('all');
              setSearchText('');
            }}
          >
            Clear Filters
          </Button>
        )}

        {/* Results Count */}
        <span style={{ marginLeft: 'auto', color: isDarkMode ? '#ccc' : '#666' }}>
          {filteredRequests.length} of {requests.length} requests
        </span>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <Empty
              description={
                searchText || selectedStatus !== 'all' || selectedType !== 'all' || selectedPriority !== 'all'
                  ? "No requests match your filters"
                  : "No requests found"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
      />
    </div>
  );
};

export default MyRequestsTable;