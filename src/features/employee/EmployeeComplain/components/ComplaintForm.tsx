import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Upload, Typography, Space, Row, Col } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import { DATE_FORMATS } from '../../../../constants';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface ComplaintFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ visible, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any>([]);

  const handleSubmit = (values: any) => {
    onSubmit({ ...values, attachments: fileList });
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title={
        <Space align="center">
          <FileTextOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <Title level={4} style={{ margin: 0, color: '#262626' }}>Submit New Complaint</Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: 600 }}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: 'HR', priority: 'Medium' }}
        size="large"
      >
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please enter the subject' }]}
        >
          <Input placeholder="Brief description of the issue" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Complaint Type"
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select placeholder="Select type">
                <Option value="HR">Human Resources</Option>
                <Option value="Management">Management</Option>
                <Option value="Safety">Safety</Option>
                <Option value="Technical">Technical</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please describe your complaint' }]}
        >
          <TextArea
            rows={4}
            placeholder="Provide detailed description of the issue..."
          />
        </Form.Item>

        <Form.Item
          name="dateOfIncident"
          label="Date of Incident (Optional)"
        >
          <DatePicker 
            style={{ width: '100%' }}
            placeholder="Select date"
            format={DATE_FORMATS.DISPLAY}
          />
        </Form.Item>

        <Form.Item
          name="attachments"
          label="Supporting Documents (Optional)"
        >
          <Upload.Dragger {...uploadProps} multiple>
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">Click or drag files to upload</p>
            <p className="ant-upload-hint">Support for PDF, JPG, PNG files</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Complaint
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};