import React from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface ComplaintFormProps {
  onSubmit: (values: any) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const uploadProps = {
    name: 'file',
    action: '/upload.do', // Replace with your actual upload endpoint
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        complaintType: 'HR',
        priority: 'medium',
      }}
    >
      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ required: true, message: 'Please enter the subject of your complaint' }]}
      >
        <Input placeholder="e.g., Workplace Harassment, Policy Violation" />
      </Form.Item>

      <Form.Item
        name="complaintType"
        label="Complaint Type"
        rules={[{ required: true, message: 'Please select a complaint type' }]}
      >
        <Select placeholder="Select type">
          <Option value="HR">Human Resources</Option>
          <Option value="Management">Management</Option>
          <Option value="TeamLead">Team Lead</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please describe your complaint' }]}
      >
        <TextArea rows={6} placeholder="Provide a detailed description of your complaint" />
      </Form.Item>

      <Form.Item
        name="dateOfIncident"
        label="Date of Incident (Optional)"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: 'Please select a priority' }]}
      >
        <Select placeholder="Select priority">
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="attachments"
        label="Attachments (Optional)"
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Complaint
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ComplaintForm;