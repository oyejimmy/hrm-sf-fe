import React from 'react';
import { Modal, Typography, Space, Divider, Timeline, Form, Input, Button, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Complaint, User, CommentFormValues } from '../types';
import { PriorityTag, StatusTag } from '../styles';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface ComplaintDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  complaint: Complaint | null;
  currentUser: User;
  mockUsers: User[];
  commentForm: any;
  onAddComment: (complaintId: string, content: string) => void;
  onUpdateStatus: (complaintId: string, status: 'pending' | 'in-progress' | 'resolved') => void;
  onAssignComplaint: (complaintId: string, assigneeId: string) => void;
  getUserName: (userId: string) => string;
  formatDate: (dateString: string) => string;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  visible,
  onCancel,
  complaint,
  currentUser,
  mockUsers,
  commentForm,
  onAddComment,
  onUpdateStatus,
  onAssignComplaint,
  getUserName,
  formatDate
}) => {
  if (!complaint) return null;

  return (
    <Modal
      title={`Complaint Details #${complaint.trackingId}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>{complaint.title}</Title>
          <Space>
            <StatusTag status={complaint.status}>
              {complaint.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </StatusTag>
            <PriorityTag priority={complaint.priority}>
              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
            </PriorityTag>
            <Text type="secondary">Category: {complaint.category}</Text>
          </Space>
        </div>
        
        <Paragraph>{complaint.description}</Paragraph>
        
        <Divider />
        
        <Title level={5}>Timeline</Title>
        <Timeline>
          <Timeline.Item color="green">
            <p>Complaint Submitted</p>
            <Text type="secondary">{formatDate(complaint.createdAt)}</Text>
          </Timeline.Item>
          {complaint.comments.map(comment => (
            <Timeline.Item key={comment.id} color={comment.isHR ? "blue" : "gray"}>
              <p>{comment.isHR ? "HR Response" : "Employee Follow-up"}</p>
              <p>{comment.content}</p>
              <Text type="secondary">{formatDate(comment.timestamp)} by {getUserName(comment.userId)}</Text>
            </Timeline.Item>
          ))}
          <Timeline.Item color="gray">
            <p>Last Updated</p>
            <Text type="secondary">{formatDate(complaint.updatedAt)}</Text>
          </Timeline.Item>
        </Timeline>
        
        <Divider />
        
        <Title level={5}>Add Comment</Title>
        <Form
          form={commentForm}
          layout="inline"
          onFinish={(values: CommentFormValues) => onAddComment(complaint.id, values.comment)}
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name="comment"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Please enter a comment' }]}
          >
            <Input.TextArea placeholder="Type your comment here..." rows={2} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Send
            </Button>
          </Form.Item>
        </Form>
        
        {currentUser.role !== 'employee' && (
          <>
            <Divider />
            
            <Title level={5}>HR Actions</Title>
            <Space>
              <Select 
                placeholder="Update Status" 
                style={{ width: 150 }}
                onChange={(value) => onUpdateStatus(complaint.id, value)}
                value={complaint.status}
              >
                <Option value="pending">Pending</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="resolved">Resolved</Option>
              </Select>
              
              <Select 
                placeholder="Assign To" 
                style={{ width: 180 }}
                onChange={(value) => onAssignComplaint(complaint.id, value)}
                value={complaint.assignedTo}
              >
                {mockUsers
                  .filter(user => user.role === 'hr' || user.role === 'admin')
                  .map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.name} ({user.department})
                    </Option>
                  ))
                }
              </Select>
            </Space>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ComplaintDetailModal;