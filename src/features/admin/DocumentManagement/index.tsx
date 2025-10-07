import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Typography,
  Tooltip,
  Avatar,
  message,
  Upload
} from 'antd';
import {
  ExclamationCircleOutlined,
  InboxOutlined
} from '@ant-design/icons';
import {
  FileText,
  Upload as UploadIcon,
  Trash2,
  Eye,
  Edit3,
  Plus,
  User,
  File,
  Image
} from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import { Container, SectionCard } from './styles';
import {
  Document,
  DocumentFormValues
} from './types';
import { useTheme } from '../../../contexts/ThemeContext';

const { Text } = Typography;
const { Option } = Select;

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    documentType: 'Resume',
    fileName: 'john_doe_resume.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2023-05-15',
    status: 'Approved',
    category: 'Employment',
    description: 'Latest resume submitted by John',
    versions: [
      { version: 1, uploadDate: '2023-05-15', uploadedBy: 'John Doe', changes: 'Initial upload' }
    ]
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    documentType: 'Contract',
    fileName: 'jane_smith_contract.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2023-05-10',
    status: 'Approved',
    category: 'Legal',
    versions: [
      { version: 1, uploadDate: '2023-05-10', uploadedBy: 'HR Admin', changes: 'Initial contract' }
    ]
  }
];

const DocumentManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isBulkUploadVisible, setIsBulkUploadVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();

  const handleAddDocument = () => {
    setEditingDocument(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    form.setFieldsValue(document);
    setIsModalVisible(true);
  };

  const handleSaveDocument = (values: DocumentFormValues) => {
    if (editingDocument) {
      setDocuments(documents.map(doc => doc.id === editingDocument.id ? { ...doc, ...values } : doc));
      message.success('Document updated successfully.');
    } else {
      const newDocument: Document = {
        id: Date.now().toString(),
        ...values,
        employeeId: values.employeeId || '1',
        employeeName: values.employeeName || 'Unknown',
        documentType: values.documentType || 'General',
        fileName: values.fileName || 'document.pdf',
        fileSize: '1.5 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        category: values.category || 'General',
        versions: [
          { version: 1, uploadDate: new Date().toISOString().split('T')[0], uploadedBy: 'Admin', changes: 'Initial upload' }
        ]
      };
      setDocuments([...documents, newDocument]);
      message.success('Document added successfully.');
    }
    setIsModalVisible(false);
  };

  const handleDeleteDocument = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this document?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        setDocuments(documents.filter(doc => doc.id !== id));
        message.success('Document deleted successfully.');
      },
    });
  };

  const handleBulkUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document);
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string) => (
        <Space>
          <Avatar size="small" icon={<User size={16} />} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileText size={16} />
          <Text ellipsis style={{ maxWidth: 150 }}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button
              icon={<Eye size={16} />}
              size="small"
              onClick={() => handlePreviewDocument(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<Edit3 size={16} />}
              size="small"
              onClick={() => handleEditDocument(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<Trash2 size={16} />}
              size="small"
              danger
              onClick={() => handleDeleteDocument(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <HeaderComponent
        title="Document Management System"
        subtitle="Manage employee documents and files"
        extraButtons={[
          <Button
            key="bulk-upload"
            icon={<UploadIcon size={16} />}
            onClick={() => setIsBulkUploadVisible(true)}
          >
            Bulk Upload
          </Button>,
          <Button
            key="add-document"
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddDocument}
          >
            Add Document
          </Button>,
        ]}
        isDarkMode={isDarkMode}
      />

      <SectionCard>
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </SectionCard>

      <Modal
        title={editingDocument ? 'Edit Document' : 'Add New Document'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveDocument}
          initialValues={editingDocument || {}}
        >
          <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true, message: 'Please enter employee name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="documentType" label="Document Type" rules={[{ required: true, message: 'Please enter document type!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fileName" label="File Name" rules={[{ required: true, message: 'Please enter file name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select>
              <Option value="Employment">Employment</Option>
              <Option value="Legal">Legal</Option>
              <Option value="Training">Training</Option>
              <Option value="General">General</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingDocument ? 'Update' : 'Add'}
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={previewDocument?.fileName}
        open={!!previewDocument}
        onCancel={handleClosePreview}
        footer={null}
        width={800}
      >
        {previewDocument && (
          <div>
            <iframe 
              src="https://docs.google.com/gview?url=https://www.africau.edu/images/default/sample.pdf&embedded=true" 
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
            <p><strong>Category:</strong> {previewDocument.category}</p>
            <p><strong>Employee:</strong> {previewDocument.employeeName}</p>
            <p><strong>Upload Date:</strong> {previewDocument.uploadDate}</p>
            <p><strong>File Size:</strong> {previewDocument.fileSize}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Bulk Upload Documents"
        open={isBulkUploadVisible}
        onCancel={() => setIsBulkUploadVisible(false)}
        footer={null}
      >
        <Upload.Dragger
          multiple
          beforeUpload={() => false}
          onChange={handleBulkUpload}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Upload.Dragger>
        <Button
          type="primary"
          onClick={() => setIsBulkUploadVisible(false)}
          style={{ marginTop: 16 }}
        >
          Done
        </Button>
      </Modal>
    </Container>
  );
};

export default DocumentManagement;