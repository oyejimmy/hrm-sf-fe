import React from "react";
import { Upload, Form, Input, Select, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Option } = Select;

const UploadCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

interface Props {
  onUpload: (doc: any) => void;
}

const DocumentUploadPanel: React.FC<Props> = ({ onUpload }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (!values.file || values.file.fileList.length === 0) {
      message.error("Please upload a file!");
      return;
    }

    const doc = {
      id: Date.now().toString(),
      name: values.name,
      type: values.type,
      description: values.description,
      status: "pending",
      uploadDate: new Date().toISOString(),
      fileUrl: URL.createObjectURL(values.file.file.originFileObj),
    };

    onUpload(doc);
    form.resetFields();
    message.success("Document uploaded successfully!");
  };

  return (
    <UploadCard title="Upload Document">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Document Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. Passport Copy" />
        </Form.Item>

        <Form.Item name="type" label="Document Type" rules={[{ required: true }]}>
          <Select placeholder="Select document type">
            <Option value="ID Proof">ID Proof</Option>
            <Option value="Resume">Resume</Option>
            <Option value="Contract">Contract</Option>
            <Option value="Certificate">Certificate</Option>
          </Select>
        </Form.Item>

        <Form.Item name="file" label="Upload File" valuePropName="file">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click or Drag to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional notes..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Upload</Button>
        </Form.Item>
      </Form>
    </UploadCard>
  );
};

export default DocumentUploadPanel;
