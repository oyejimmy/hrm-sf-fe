import React from 'react';
import { Modal, Form, Input, Select, Upload, Button, Alert } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { ComplaintFormValues } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface SubmitComplaintModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ComplaintFormValues) => void;
  form: any;
  complaintCategories: string[];
}

const SubmitComplaintModal: React.FC<SubmitComplaintModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  complaintCategories
}) => {
  return (
    <Modal
      title="Submit New Complaint"
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
          label="Complaint Title"
          rules={[{ required: true, message: 'Please enter a title for your complaint' }]}
        >
          <Input placeholder="Brief description of your complaint" />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select category">
            {complaintCategories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select priority' }]}
          initialValue="medium"
        >
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Detailed Description"
          rules={[{ required: true, message: 'Please provide a detailed description' }]}
        >
          <TextArea rows={4} placeholder="Please describe your complaint in detail..." />
        </Form.Item>
        
        <Form.Item
          name="attachments"
          label="Attachments (Optional)"
        >
          <Upload
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<PaperClipOutlined />}>Add Attachments</Button>
          </Upload>
        </Form.Item>
        
        <Alert
          message="Your privacy is important"
          description="All complaints are treated with strict confidentiality. Retaliation against employees who make complaints in good faith is strictly prohibited."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit Complaint
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubmitComplaintModal;