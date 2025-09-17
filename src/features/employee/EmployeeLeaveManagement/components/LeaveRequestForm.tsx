import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Space,
  Radio,
  Divider,
  Avatar,
  Tag,
  message,
  Row,
  Col
} from 'antd';
import { Send, Upload as UploadIcon, User, Mail, Building } from 'lucide-react';
import styled from 'styled-components';
import { LeaveType, DurationType, Employee } from '../types';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const RecipientCard = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin: 4px;
  background: var(--surface);
`;

const RecipientInfo = styled.div`
  margin-left: 8px;
  flex: 1;
`;

interface LeaveRequestFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@company.com', department: 'HR', role: 'HR Manager', avatar: '' },
  { id: '2', name: 'Mike Chen', email: 'mike.c@company.com', department: 'Engineering', role: 'Team Lead', avatar: '' },
  { id: '3', name: 'Lisa Rodriguez', email: 'lisa.r@company.com', department: 'Operations', role: 'Operations Manager', avatar: '' },
  { id: '4', name: 'David Kim', email: 'david.k@company.com', department: 'Finance', role: 'Finance Head', avatar: '' },
];

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [selectedRecipients, setSelectedRecipients] = useState<Employee[]>([]);
  const [durationType, setDurationType] = useState<DurationType>('Full Day');

  const handleSubmit = (values: any) => {
    if (selectedRecipients.length === 0) {
      message.error('Please select at least one recipient');
      return;
    }

    const formData = {
      ...values,
      recipients: selectedRecipients.map(r => r.id),
      recipientDetails: selectedRecipients,
      durationType,
      appliedAt: new Date().toISOString(),
      status: 'Pending'
    };

    onSubmit(formData);
  };

  const handleRecipientChange = (recipientIds: string[]) => {
    const recipients = mockEmployees.filter(emp => recipientIds.includes(emp.id));
    setSelectedRecipients(recipients);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRecipients([]);
    setDurationType('Full Day');
    onCancel();
  };

  return (
    <Modal
      title="Submit Leave Request"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Leave Type"
              name="type"
              rules={[{ required: true, message: 'Please select leave type' }]}
            >
              <Select placeholder="Select leave type">
                <Option value="Annual">Annual Leave</Option>
                <Option value="Sick">Sick Leave</Option>
                <Option value="Casual">Casual Leave</Option>
                <Option value="Half Day">Half Day</Option>
                <Option value="Comp Off">Compensatory Off</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Duration Type">
              <Radio.Group
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
              >
                <Radio value="Full Day">Full Day</Radio>
                <Radio value="Half Day - Morning">Half Day AM</Radio>
                <Radio value="Half Day - Afternoon">Half Day PM</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Date Range"
          name="dates"
          rules={[{ required: true, message: 'Please select dates' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Reason"
          name="reason"
          rules={[{ required: true, message: 'Please provide reason' }]}
        >
          <TextArea rows={3} placeholder="Please provide details for your leave request" />
        </Form.Item>

        <Form.Item label="Attachment (Optional)">
          <Upload>
            <Button icon={<UploadIcon size={16} />}>Upload Document</Button>
          </Upload>
        </Form.Item>

        <Divider>Select Recipients</Divider>

        <Form.Item
          label="Notify Recipients"
          help="Select HR managers, team leads, or other stakeholders who should be notified"
        >
          <Select
            mode="multiple"
            placeholder="Select recipients to notify"
            onChange={handleRecipientChange}
            style={{ width: '100%' }}
          >
            {mockEmployees.map(emp => (
              <Option key={emp.id} value={emp.id}>
                <Space>
                  <Avatar size="small" icon={<User size={14} />} />
                  {emp.name} - {emp.role}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedRecipients.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Selected Recipients:</div>
            {selectedRecipients.map(recipient => (
              <RecipientCard key={recipient.id}>
                <Avatar size="small" icon={<User size={14} />} />
                <RecipientInfo>
                  <div style={{ fontWeight: 500 }}>{recipient.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Mail size={12} style={{ marginRight: 4 }} />
                    {recipient.email}
                    <Building size={12} style={{ marginLeft: 8, marginRight: 4 }} />
                    {recipient.department}
                  </div>
                </RecipientInfo>
                <Tag color="blue">{recipient.role}</Tag>
              </RecipientCard>
            ))}
          </div>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<Send size={16} />} loading={loading}>
              Submit Request
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaveRequestForm;