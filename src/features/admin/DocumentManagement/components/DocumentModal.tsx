import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Row, Col, Typography } from 'antd';
import { CloudUpload } from 'lucide-react';
import { DocumentFormValues, Employee, DocumentType } from '../types';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface DocumentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: DocumentFormValues) => void;
  form: any;
  selectedDocument: any;
  mockEmployees: Employee[];
  mockDocumentTypes: DocumentType[];
  mockCategories: string[];
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  selectedDocument,
  mockEmployees,
  mockDocumentTypes,
  mockCategories
}) => {
  return (
    <Modal
      title={selectedDocument ? 'Edit Document' : 'Add New Document'}
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select placeholder="Select employee">
                {mockEmployees.map(emp => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="documentType"
              label="Document Type"
              rules={[{ required: true, message: 'Please select a document type' }]}
            >
              <Select placeholder="Select document type">
                {mockDocumentTypes.map((type: any) => (
                  <Option key={type.id} value={type.name}>
                    {type.name} {type.required && <Text type="secondary">(Required)</Text>}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select category">
            {mockCategories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="uploadDate"
          label="Upload Date"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={3} placeholder="Enter document description (optional)" />
        </Form.Item>
        
        <Form.Item
          name="file"
          label="File"
          rules={[{ required: !selectedDocument, message: 'Please upload a file' }]}
        >
          <Upload.Dragger 
            name="file"
            multiple={false}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <CloudUpload size={48} />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single file upload. Maximum file size: 10MB
            </p>
          </Upload.Dragger>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {selectedDocument ? 'Update Document' : 'Add Document'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentModal;