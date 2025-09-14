import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { AnnouncementFormValues } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface AnnouncementModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AnnouncementFormValues) => void;
  form: any;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form
}) => {
  return (
    <Modal
      title="New Announcement"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
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
          <Input placeholder="Enter announcement title" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <TextArea rows={4} placeholder="Enter announcement content..." />
        </Form.Item>
        
        <Form.Item
          name="targetRoles"
          label="Target Audience"
          rules={[{ required: true, message: 'Please select target audience' }]}
        >
          <Select mode="multiple" placeholder="Select target roles">
            <Option value="admin">Admin</Option>
            <Option value="hr">HR</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="priority"
          label="Priority"
          initialValue="medium"
        >
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Announcement
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnnouncementModal;