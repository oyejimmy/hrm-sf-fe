import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { NotificationFormValues } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface NotificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: NotificationFormValues) => void;
  form: any;
  selectedNotification: any;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  selectedNotification
}) => {
  return (
    <Modal
      title={selectedNotification ? 'Edit Notification' : 'Add New Notification'}
      visible={visible}
      width={600}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter notification title" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <TextArea rows={4} placeholder="Enter notification content" />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="critical">Critical</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select category">
                <Option value="system">System</Option>
                <Option value="hr">HR</Option>
                <Option value="employee_request">Employee Request</Option>
                <Option value="general">General</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="recipientType"
          label="Recipient Type"
          rules={[{ required: true, message: 'Please select recipient type' }]}
        >
          <Select placeholder="Select recipient type">
            <Option value="all">All Users</Option>
            <Option value="role_based">Role Based</Option>
            <Option value="specific">Specific Users</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="createdAt"
          label="Created Date"
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {selectedNotification ? 'Update Notification' : 'Add Notification'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NotificationModal;