import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Avatar,
  Tooltip,
  Row,
  Col,
  Typography
} from 'antd';
import {
  Check,
  X,
  Clock,
  MessageSquare,
  User,
  Calendar,
  FileText,
} from 'lucide-react';
import styled from 'styled-components';
import { LeaveRequest, LeaveApprovalRequest, ApprovalAction } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const ActionButton = styled(Button) <{ $action: string }>`
  ${props => {
    switch (props.$action) {
      case 'approve':
        return 'border-color: #52c41a; color: #52c41a; &:hover { background: #f6ffed; }';
      case 'reject':
        return 'border-color: #ff4d4f; color: #ff4d4f; &:hover { background: #fff2f0; }';
      case 'hold':
        return 'border-color: #faad14; color: #faad14; &:hover { background: #fffbe6; }';
      default:
        return '';
    }
  }}
`;

const RequestCard = styled(Card)`
  margin-bottom: 16px;
  .ant-card-body {
    padding: 16px;
  }
`;

interface LeaveApprovalWorkflowProps {
  pendingApprovals: LeaveRequest[];
  onApprove: (approval: LeaveApprovalRequest) => Promise<void>;
  onReject: (approval: LeaveApprovalRequest) => Promise<void>;
}

const LeaveApprovalWorkflow: React.FC<LeaveApprovalWorkflowProps> = ({
  pendingApprovals,
  onApprove,
  onReject,
}) => {
  const [actionModal, setActionModal] = useState<{
    visible: boolean;
    request?: LeaveRequest;
    action?: ApprovalAction;
  }>({ visible: false });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleActionClick = (request: LeaveRequest, action: ApprovalAction) => {
    setActionModal({ visible: true, request, action });
  };

  const handleActionSubmit = async (values: any) => {
    if (!actionModal.request || !actionModal.action) return;

    setLoading(true);
    const approval: LeaveApprovalRequest = {
      requestId: actionModal.request.id,
      action: actionModal.action,
      comments: values.comments,
      additionalDetailsRequired: values.additionalDetails
    };

    if (actionModal.action === 'approve') {
      await onApprove(approval);
    } else if (actionModal.action === 'reject') {
      await onReject(approval);
    }

    setLoading(false);
    setActionModal({ visible: false });
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      case 'On Hold': return 'orange';
      case 'Pending': return 'blue';
      default: return 'default';
    }
  };

  const getActionTitle = (action?: ApprovalAction) => {
    switch (action) {
      case 'approve': return 'Approve Leave Request';
      case 'reject': return 'Reject Leave Request';
      case 'hold': return 'Place on Hold';
      case 'request_details': return 'Request Additional Details';
      default: return 'Action';
    }
  };

  const pendingRequests = pendingApprovals.filter(req => req.status === 'Pending');

  return (
    <>
      <Card title={`Pending Approvals (${pendingRequests.length})`}>
        {pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No pending leave requests
          </div>
        ) : (
          pendingRequests.map(request => (
            <RequestCard key={request.id} size="small">
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Space direction="vertical" size={4}>
                    <Space>
                      <Avatar size="small" icon={<User size={14} />} />
                      <Text strong>{request.employeeName}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {request.department}
                    </Text>
                  </Space>
                </Col>

                <Col span={4}>
                  <Space direction="vertical" size={4}>
                    <Tag color="blue">{request.type}</Tag>
                    <Text style={{ fontSize: '12px' }}>{request.durationType}</Text>
                  </Space>
                </Col>

                <Col span={6}>
                  <Space direction="vertical" size={4}>
                    <Space size={4}>
                      <Calendar size={14} />
                      <Text style={{ fontSize: '12px' }}>
                        {new Date(request.from).toLocaleDateString()} - {new Date(request.to).toLocaleDateString()}
                      </Text>
                    </Space>
                    <Text style={{ fontSize: '12px' }}>
                      {request.duration} day{request.duration !== 1 ? 's' : ''}
                    </Text>
                  </Space>
                </Col>

                <Col span={4}>
                  <Tooltip title={request.reason}>
                    <Text ellipsis style={{ fontSize: '12px', maxWidth: '100px' }}>
                      <FileText size={12} style={{ marginRight: 4 }} />
                      {request.reason}
                    </Text>
                  </Tooltip>
                </Col>

                <Col span={4}>
                  <Space>
                    <ActionButton
                      $action="approve"
                      size="small"
                      icon={<Check size={14} />}
                      onClick={() => handleActionClick(request, 'approve')}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      $action="reject"
                      size="small"
                      icon={<X size={14} />}
                      onClick={() => handleActionClick(request, 'reject')}
                    >
                      Reject
                    </ActionButton>
                    <ActionButton
                      $action="hold"
                      size="small"
                      icon={<Clock size={14} />}
                      onClick={() => handleActionClick(request, 'hold')}
                    >
                      Hold
                    </ActionButton>
                    <Button
                      size="small"
                      icon={<MessageSquare size={14} />}
                      onClick={() => handleActionClick(request, 'request_details')}
                    >
                      Details
                    </Button>
                  </Space>
                </Col>
              </Row>

              {request.recipientDetails.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Notified: {request.recipientDetails.map(r => r.name).join(', ')}
                  </Text>
                </div>
              )}
            </RequestCard>
          ))
        )}
      </Card>

      <Modal
        title={getActionTitle(actionModal.action)}
        open={actionModal.visible}
        onCancel={() => setActionModal({ visible: false })}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleActionSubmit}>
          {actionModal.request && (
            <div style={{ marginBottom: 16, padding: 12, background: 'var(--surface-secondary)', borderRadius: 6 }}>
              <Space direction="vertical" size={4}>
                <Text strong>{actionModal.request.employeeName}</Text>
                <Text>{actionModal.request.type} - {actionModal.request.durationType}</Text>
                <Text type="secondary">
                  {new Date(actionModal.request.from).toLocaleDateString()} - {new Date(actionModal.request.to).toLocaleDateString()}
                </Text>
                <Text type="secondary">{actionModal.request.reason}</Text>
              </Space>
            </div>
          )}

          {actionModal.action === 'request_details' && (
            <Form.Item
              label="Additional Details Required"
              name="additionalDetails"
              rules={[{ required: true, message: 'Please specify what details are needed' }]}
            >
              <TextArea
                rows={3}
                placeholder="Specify what additional information is required from the employee"
              />
            </Form.Item>
          )}

          <Form.Item
            label="Comments"
            name="comments"
            rules={actionModal.action === 'reject' ? [{ required: true, message: 'Please provide reason for rejection' }] : []}
          >
            <TextArea
              rows={3}
              placeholder={
                actionModal.action === 'approve' ? 'Optional approval comments' :
                  actionModal.action === 'reject' ? 'Please provide reason for rejection' :
                    'Optional comments'
              }
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {actionModal.action === 'approve' ? 'Approve' :
                  actionModal.action === 'reject' ? 'Reject' :
                    actionModal.action === 'hold' ? 'Place on Hold' :
                      'Request Details'}
              </Button>
              <Button onClick={() => setActionModal({ visible: false })}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LeaveApprovalWorkflow;