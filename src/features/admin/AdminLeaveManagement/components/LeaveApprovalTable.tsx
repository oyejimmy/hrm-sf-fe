import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Alert,
  Grid,
  Avatar
} from 'antd';
import {
  Check,
  X,
  Eye,
  User,
  Building,
  Mail
} from 'lucide-react';
import styled from 'styled-components';
import { LeaveRequest } from '../types';
import { useTheme } from '../../../../contexts/ThemeContext';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface Props {
  requests: LeaveRequest[];
  onApprove: (id: string, comments?: string) => void;
  onReject: (id: string, comments: string) => void;
  onHold?: (id: string, comments: string) => void;
  loading?: boolean;
}

const StyledTable = styled(Table)<{ $isDarkMode: boolean }>`
  .ant-table {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
  
  .ant-table-thead > tr > th {
    background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'};
    color: ${props => props.$isDarkMode ? 'var(--text-primary)' : '#000000d9'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-table-tbody > tr:hover > td {
    background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#fafafa'} !important;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px 4px;
      font-size: 12px;
    }
  }
`;

const ActionModal = styled(Modal)<{ $isDarkMode: boolean }>`
  .ant-modal-content {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
  
  .ant-modal-header {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#f0f0f0'};
  }
  
  .ant-modal-body {
    background: ${props => props.$isDarkMode ? 'var(--surface)' : '#ffffff'};
  }
`;

const EmployeeCard = styled(Card)<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? 'var(--surfaceSecondary)' : '#f8f9fa'};
  border: 1px solid ${props => props.$isDarkMode ? 'var(--border)' : '#e9ecef'};
  margin-bottom: 16px;
`;

const LeaveApprovalTable: React.FC<Props> = ({ 
  requests, 
  onApprove, 
  onReject, 
  onHold, 
  loading 
}) => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'hold' | 'view'>('view');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'processing',
      'Approved': 'success',
      'Rejected': 'error',
      'On Hold': 'warning'
    };
    return colors[status] || 'default';
  };

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Annual': '#52c41a',
      'Sick': '#ff4d4f',
      'Casual': '#1890ff',
      'Maternity': '#722ed1',
      'Paternity': '#13c2c2',
      'Unpaid': '#faad14'
    };
    return colors[type] || '#d9d9d9';
  };

  const handleAction = (request: LeaveRequest, action: 'approve' | 'reject' | 'hold' | 'view') => {
    setSelectedRequest(request);
    setActionType(action);
    setModalVisible(true);
    
    if (action === 'approve') {
      form.setFieldsValue({ comments: '' });
    } else {
      form.resetFields();
    }
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest) return;
    
    try {
      const values = await form.validateFields();
      
      switch (actionType) {
        case 'approve':
          onApprove(selectedRequest.id, values.comments);
          break;
        case 'reject':
          onReject(selectedRequest.id, values.comments);
          break;
        case 'hold':
          if (onHold) onHold(selectedRequest.id, values.comments);
          break;
      }
      
      setModalVisible(false);
      setSelectedRequest(null);
      form.resetFields();
    } catch (error) {
      // Form validation failed
    }
  };



  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      width: screens.xs ? 120 : 200,
      render: (record: LeaveRequest) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.employee}</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>{record.department}</div>
        </div>
      )
    },
    {
      title: 'Leave Details',
      key: 'details',
      width: screens.xs ? 150 : 250,
      render: (record: LeaveRequest) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.type}</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>{record.duration}</div>
        </div>
      )
    },
    {
      title: 'Dates',
      key: 'dates',
      width: screens.xs ? 120 : 180,
      render: (record: LeaveRequest) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            {dayjs(record.fromDate).format('MMM DD, YYYY')}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>
            to {dayjs(record.toDate).format('MMM DD, YYYY')}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: screens.xs ? 80 : 120,
      render: (record: LeaveRequest) => (
        <Space>
          {record.status === 'Pending' ? (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handleAction(record, 'approve')}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleAction(record, 'reject')}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              size="small"
              onClick={() => handleAction(record, 'view')}
            >
              View
            </Button>
          )}
        </Space>
      )
    }
  ];

  const renderModalContent = () => {
    if (!selectedRequest) return null;

    if (actionType === 'view') {
      return (
        <div>
          <EmployeeCard $isDarkMode={isDarkMode}>
            <Row gutter={16}>
              <Col span={6}>
                <Avatar size={64} icon={<User size={24} />} />
              </Col>
              <Col span={18}>
                <Title level={4} style={{ margin: 0 }}>{selectedRequest.employee}</Title>
                <Space direction="vertical" size={4}>
                  <Text type="secondary"><Building size={14} /> {selectedRequest.department}</Text>
                  <Text type="secondary"><Mail size={14} /> {selectedRequest.employeeId}@company.com</Text>
                </Space>
              </Col>
            </Row>
          </EmployeeCard>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card size="small" title="Leave Information">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Type:</Text>
                    <div>
                      <Space>
                        <div 
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getLeaveTypeColor(selectedRequest.type)
                          }}
                        />
                        <Text strong>{selectedRequest.type} Leave</Text>
                      </Space>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Duration:</Text>
                    <div><Text strong>{selectedRequest.duration}</Text></div>
                  </div>
                  <div>
                    <Text type="secondary">Status:</Text>
                    <div><Tag color={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Tag></div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" title="Date Range">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">From:</Text>
                    <div><Text strong>{dayjs(selectedRequest.fromDate).format('MMMM DD, YYYY')}</Text></div>
                  </div>
                  <div>
                    <Text type="secondary">To:</Text>
                    <div><Text strong>{dayjs(selectedRequest.toDate).format('MMMM DD, YYYY')}</Text></div>
                  </div>
                  <div>
                    <Text type="secondary">Applied:</Text>
                    <div><Text>{dayjs().format('MMMM DD, YYYY')}</Text></div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
          
          <Card size="small" title="Reason" style={{ marginTop: 16 }}>
            {selectedRequest.reason}
          </Card>
        </div>
      );
    }

    return (
      <Form form={form} layout="vertical">
        <Alert
          message={`${actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Hold'} Leave Request`}
          description={`You are about to ${actionType} the leave request for ${selectedRequest.employee}.`}
          type={actionType === 'approve' ? 'success' : actionType === 'reject' ? 'error' : 'warning'}
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form.Item
          label="Comments"
          name="comments"
          rules={actionType === 'reject' || actionType === 'hold' ? 
            [{ required: true, message: 'Please provide comments' }] : []
          }
        >
          <TextArea
            rows={4}
            placeholder={`Please provide ${actionType === 'approve' ? 'optional' : 'required'} comments...`}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    );
  };

  const getModalTitle = () => {
    if (!selectedRequest) return '';
    
    const titles = {
      view: 'Leave Request Details',
      approve: 'Approve Leave Request',
      reject: 'Reject Leave Request',
      hold: 'Put Leave Request on Hold'
    };
    
    return titles[actionType];
  };

  return (
    <>
      <StyledTable
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} requests`
        }}
        scroll={{ x: screens.xs ? 600 : 'auto' }}
        size={screens.xs ? 'small' : 'middle'}
        $isDarkMode={isDarkMode}
      />
      
      <ActionModal
        title={getModalTitle()}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedRequest(null);
          form.resetFields();
        }}
        footer={actionType === 'view' ? [
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type={actionType === 'approve' ? 'primary' : 'default'}
            danger={actionType === 'reject'}
            onClick={handleSubmitAction}
            loading={loading}
          >
            {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Put on Hold'}
          </Button>
        ]}
        width={actionType === 'view' ? 800 : 500}
        centered
        $isDarkMode={isDarkMode}
      >
        {renderModalContent()}
      </ActionModal>
    </>
  );
};

export default LeaveApprovalTable;
