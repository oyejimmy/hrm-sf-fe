import React, { useState, useMemo } from 'react';
import { Table, Tag, Space, Button, Modal, Input, Dropdown, MenuProps, Empty, Row, Col } from 'antd';
import ReactDOM from 'react-dom/client';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, Calendar, User, DollarSign, MessageCircle } from 'lucide-react';

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
      responsive: ['md' as const],
      render: (id: string) => <span style={{ fontWeight: 'bold' }}>#{id}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      responsive: ['sm' as const],
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
      render: (subject: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{subject}</div>
          <div style={{ 
            fontSize: '12px', 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
            display: 'block'
          }}>
            <span className="mobile-only">
              <Tag color={getTypeColor(record.type)} style={{ marginRight: 4, fontSize: '11px' }}>
                {record.type}
              </Tag>
              <Tag color={getStatusColor(record.status)} style={{ fontSize: '11px' }}>
                {record.status.replace('_', ' ')}
              </Tag>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      responsive: ['md' as const],
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
      responsive: ['lg' as const],
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
      responsive: ['lg' as const],
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      responsive: ['xl' as const],
      render: (details: string) => (
        <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)' }}>
          {details}
        </span>
      ),
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
              const RequestDetailsModal = () => {
                const [visible, setVisible] = useState(true);
                const isDarkMode = false; // Default to light mode since we're outside ThemeProvider
                
                const getStatusConfig = (status: any) => {
                  switch (status) {
                    case 'pending': return { icon: <Clock />, tone: 'lightPeach' as const };
                    case 'approved': return { icon: <CheckCircle />, tone: 'pastelGreen' as const };
                    case 'rejected': return { icon: <XCircle />, tone: 'pastelPink' as const };
                    case 'in_progress': return { icon: <Clock />, tone: 'pastelBlue' as const };
                    default: return { icon: <FileText />, tone: 'softLavender' as const };
                  }
                };
                
                const getPriorityConfig = (priority: string) => {
                  switch (priority) {
                    case 'high': return { icon: <AlertTriangle />, tone: 'pastelPink' as const };
                    case 'medium': return { icon: <AlertTriangle />, tone: 'lightPeach' as const };
                    case 'low': return { icon: <AlertTriangle />, tone: 'pastelGreen' as const };
                    default: return { icon: <AlertTriangle />, tone: 'softLavender' as const };
                  }
                };
                
                const statusConfig = getStatusConfig(record.status);
                const priorityConfig = getPriorityConfig(record.priority);
                
                return (
                  <Modal
                    title={null}
                    open={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                    width="95%"
                    style={{ maxWidth: 700 }}
                    centered
                    destroyOnClose
                  >
                    <div style={{ padding: '8px 0' }}>
                      {/* Header */}
                      <div style={{
                        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '24px',
                        color: 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FileText size={24} color="white" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '600', color: 'white' }}>
                              {record.subject}
                            </h2>
                            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                              Request ID: #{record.id}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Cards */}
                      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={8}>
                          <div style={{
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fafafa',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center'
                          }}>
                            <div style={{ marginBottom: '8px' }}>{statusConfig.icon}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Status</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                              {record.status.replace('_', ' ')}
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} sm={8}>
                          <div style={{
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fafafa',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center'
                          }}>
                            <div style={{ marginBottom: '8px' }}><FileText /></div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Type</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                              {record.type}
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} sm={8}>
                          <div style={{
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fafafa',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center'
                          }}>
                            <div style={{ marginBottom: '8px' }}>{priorityConfig.icon}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Priority</div>
                            <div style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                              {record.priority}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      {/* Details Section */}
                      <div style={{
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#262626' }}>Request Details</h3>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>Date Submitted</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={16} />
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{new Date(record.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </Col>
                          {record.amount && (
                            <Col xs={24} sm={12}>
                              <div style={{ marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>Amount</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <DollarSign size={16} />
                                  <span style={{ fontSize: '14px', fontWeight: '500' }}>${record.amount?.toLocaleString()}</span>
                                </div>
                              </div>
                            </Col>
                          )}
                          {record.approver && (
                            <Col xs={24} sm={12}>
                              <div style={{ marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '4px' }}>Approver</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <User size={16} />
                                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{record.approver}</span>
                                </div>
                              </div>
                            </Col>
                          )}
                        </Row>
                        <div style={{ marginTop: '16px' }}>
                          <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>Description</span>
                          <p style={{ 
                            fontSize: '14px', 
                            lineHeight: '1.6', 
                            margin: 0, 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #f0f0f0'
                          }}>
                            {record.details}
                          </p>
                        </div>
                      </div>
                      
                      {/* Comments Section */}
                      {record.approverComments && (
                        <div style={{
                          backgroundColor: record.status === 'rejected' ? '#fff2f0' : '#f6ffed',
                          borderRadius: '8px',
                          padding: '20px',
                          marginBottom: '20px',
                          border: `1px solid ${record.status === 'rejected' ? '#ffccc7' : '#b7eb8f'}`
                        }}>
                          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600', color: '#262626' }}>Approver Comments</h3>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <MessageCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                              {record.approverComments}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div style={{ textAlign: 'right', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                        <Button type="primary" onClick={() => setVisible(false)} size="large">
                          Close
                        </Button>
                      </div>
                    </div>
                  </Modal>
                );
              };
              
              const modalRoot = document.createElement('div');
              document.body.appendChild(modalRoot);
              const root = ReactDOM.createRoot(modalRoot);
              root.render(<RequestDetailsModal />);
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
      {/* Search and Filter Controls */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search requests..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Dropdown menu={{ items: statusItems }} trigger={['click']}>
            <Button icon={<FilterOutlined />} block size="large">
              Status
            </Button>
          </Dropdown>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Dropdown menu={{ items: typeItems }} trigger={['click']}>
            <Button icon={<FilterOutlined />} block size="large">
              Type
            </Button>
          </Dropdown>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Dropdown menu={{ items: priorityItems }} trigger={['click']}>
            <Button icon={<FilterOutlined />} block size="large">
              Priority
            </Button>
          </Dropdown>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          {(selectedStatus !== 'all' || selectedType !== 'all' || selectedPriority !== 'all' || searchText) && (
            <Button 
              onClick={() => {
                setSelectedStatus('all');
                setSelectedType('all');
                setSelectedPriority('all');
                setSearchText('');
              }}
              block
              size="large"
            >
              Clear
            </Button>
          )}
        </Col>
        <Col xs={24} lg={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ color: isDarkMode ? '#ccc' : '#666', fontSize: '14px' }}>
            {filteredRequests.length} of {requests.length} requests
          </span>
        </Col>
      </Row>

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
          responsive: true,
        }}
        scroll={{ x: 800 }}
        size="middle"
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