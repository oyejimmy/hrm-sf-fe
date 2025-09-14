import React from 'react';
import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { MessageFormValues, User } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface MessageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: MessageFormValues) => void;
  form: any;
  mockUsers: User[];
  currentUser: User;
}

const MessageModal: React.FC<MessageModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  mockUsers,
  currentUser
}) => {
  return (
    <Modal
      title="New Message"
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
          name="recipients"
          label="Recipients"
          rules={[{ required: true, message: 'Please select recipients' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select recipients"
            optionFilterProp="children"
          >
            {mockUsers
              .filter(user => user.id !== currentUser.id)
              .map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.role.toUpperCase()})
                </Option>
              ))
            }
          </Select>
        </Form.Item>
        
        <Form.Item
          name="content"
          label="Message"
          rules={[{ required: true, message: 'Please enter a message' }]}
        >
          <TextArea rows={4} placeholder="Enter your message..." />
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
        
        <Form.Item
          name="attachments"
          label="Attachments"
        >
          <Upload
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<PaperClipOutlined />}>Add Attachments</Button>
          </Upload>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MessageModal;