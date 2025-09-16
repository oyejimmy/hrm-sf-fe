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
  Row,
  Col,
  Dropdown,
  Typography,
  Tooltip,
  Avatar,
  Tabs,
  App,
  theme
} from 'antd';
import {
  FileText,
  Upload as UploadIcon,
  Trash2,
  Eye,
  Edit3,
  Plus,
  Search,
  User,
  File,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  FileArchive,
  CloudUpload,
  Download,
  History,
  FileBox,
  FolderOpen,
  FolderCheck,
  FolderX,
  FileCheck,
  FileX,
  FileQuestion
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import HeaderComponent from '../../../components/PageHeader';
import DocumentModal from './components/DocumentModal';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import BulkUploadModal from './components/BulkUploadModal';
import { Container, FilterCard, DocumentCard, StyledTabs } from './components/styles';
import {
  Employee,
  Document,
  DocumentType,
  FilterOptions,
  DocumentFormValues
} from './types';

const { Text } = Typography;
const { Option } = Select;

// Mock data service functions
const fetchEmployees = async (): Promise<Employee[]> => {
  // Commented out for future API implementation
  // const response = await fetch('/api/employees');
  // return response.json();
  return [
    { id: '1', name: 'John Doe', department: 'Engineering', email: 'john.doe@company.com' },
    { id: '2', name: 'Jane Smith', department: 'Marketing', email: 'jane.smith@company.com' },
    { id: '3', name: 'Robert Johnson', department: 'Sales', email: 'robert.johnson@company.com' },
    { id: '4', name: 'Emily Davis', department: 'Engineering', email: 'emily.davis@company.com' },
    { id: '5', name: 'Michael Wilson', department: 'HR', email: 'michael.wilson@company.com' },
  ];
};

const fetchDocumentTypes = async (): Promise<DocumentType[]> => {
  // Commented out for future API implementation
  // const response = await fetch('/api/document-types');
  // return response.json();
  return [
    { id: '1', name: 'Resume', icon: <FileText size={16} color="#3498db" />, required: true },
    { id: '2', name: 'Contract', icon: <File size={16} color="#e74c3c" />, required: true },
    { id: '3', name: 'ID Proof', icon: <FileText size={16} color="#2ecc71" />, required: true },
    { id: '4', name: 'Offer Letter', icon: <FileText size={16} color="#f39c12" />, required: false },
    { id: '5', name: 'NDA', icon: <File size={16} color="#9b59b6" />, required: false },
    { id: '6', name: 'Training Certificate', icon: <FileText size={16} color="#1abc9c" />, required: false },
    { id: '7', name: 'Performance Review', icon: <File size={16} color="#d35400" />, required: false },
  ];
};

const fetchCategories = async (): Promise<string[]> => {
  // Commented out for future API implementation
  // const response = await fetch('/api/categories');
  // return response.json();
  return [
    'Employment',
    'Legal',
    'Training',
    'Performance',
    'Benefits',
    'Miscellaneous'
  ];
};

const fetchDocuments = async (): Promise<Document[]> => {
  // Commented out for future API implementation
  // const response = await fetch('/api/documents');
  // return response.json();
  return [
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
        { version: 1, uploadDate: '2023-05-15', uploadedBy: 'John Doe', changes: 'Initial upload' },
        { version: 2, uploadDate: '2023-05-20', uploadedBy: 'John Doe', changes: 'Updated work experience' }
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
    },
    {
      id: '3',
      employeeId: '4',
      employeeName: 'Emily Davis',
      documentType: 'ID Proof',
      fileName: 'emily_davis_id.jpg',
      fileSize: '1.8 MB',
      uploadDate: '2023-05-12',
      status: 'Pending',
      category: 'Employment',
      versions: [
        { version: 1, uploadDate: '2023-05-12', uploadedBy: 'Emily Davis', changes: 'Driver license upload' }
      ]
    },
    {
      id: '4',
      employeeId: '3',
      employeeName: 'Robert Johnson',
      documentType: 'Offer Letter',
      fileName: 'robert_johnson_offer.docx',
      fileSize: '0.8 MB',
      uploadDate: '2023-05-05',
      status: 'Rejected',
      category: 'Employment',
      description: 'Needs signature',
      versions: [
        { version: 1, uploadDate: '2023-05-05', uploadedBy: 'HR Admin', changes: 'Initial offer letter' }
      ]
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'Michael Wilson',
      documentType: 'Training Certificate',
      fileName: 'michael_wilson_training.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2023-04-28',
      status: 'Approved',
      category: 'Training',
      versions: [
        { version: 1, uploadDate: '2023-04-28', uploadedBy: 'Michael Wilson', changes: 'Completed safety training' }
      ]
    },
  ];
};

const addDocument = async (document: Document): Promise<Document> => {
  // Commented out for future API implementation
  // const response = await fetch('/api/documents', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(document),
  // });
  // return response.json();
  return { ...document, id: Date.now().toString() };
};

const updateDocument = async (document: Document): Promise<Document> => {
  // Commented out for future API implementation
  // const response = await fetch(`/api/documents/${document.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(document),
  // });
  // return response.json();
  return document;
};

const deleteDocument = async (id: string): Promise<void> => {
  // Commented out for future API implementation
  // await fetch(`/api/documents/${id}`, { method: 'DELETE' });
};

// Status colors and icons
const statusColors: Record<string, string> = {
  Approved: 'green',
  Pending: 'orange',
  Rejected: 'red'
};

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle size={16} color="#52c41a" />,
  Pending: <Clock size={16} color="#faad14" />,
  Rejected: <XCircle size={16} color="#ff4d4f" />
};

const fileTypeIcons: Record<string, React.ReactNode> = {
  'pdf': <File size={16} style={{ color: '#e74c3c' }} />,
  'doc': <FileText size={16} style={{ color: '#2b579a' }} />,
  'docx': <FileText size={16} style={{ color: '#2b579a' }} />,
  'xls': <FileText size={16} style={{ color: '#217346' }} />,
  'xlsx': <FileText size={16} style={{ color: '#217346' }} />,
  'jpg': <FileText size={16} style={{ color: '#d35400' }} />,
  'jpeg': <FileText size={16} style={{ color: '#d35400' }} />,
  'png': <FileText size={16} style={{ color: '#2980b9' }} />,
  'zip': <File size={16} style={{ color: '#7d3c98' }} />,
  'default': <FileQuestion size={16} style={{ color: '#95a5a6' }} />
};

// Tab icons
const tabIcons = {
  all: <FolderOpen size={16} />,
  Approved: <FolderCheck size={16} />,
  Pending: <FileBox size={16} />,
  Rejected: <FolderX size={16} />
};

// Main Component
const DocumentManagement: React.FC = () => {
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  
  // State management
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isBulkUploadVisible, setIsBulkUploadVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('all');

  // TanStack Query hooks
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { data: documentTypes = [] } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: fetchDocumentTypes,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  const addDocumentMutation = useMutation({
    mutationFn: addDocument,
    onSuccess: (newDocument) => {
      queryClient.setQueryData(['documents'], (old: Document[] = []) => [...old, newDocument]);
      message.success('Document added successfully');
    },
    onError: () => {
      message.error('Failed to add document');
    }
  });

  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(['documents'], (old: Document[] = []) => 
        old.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
      );
      message.success('Document updated successfully');
    },
    onError: () => {
      message.error('Failed to update document');
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['documents'], (old: Document[] = []) => 
        old.filter(doc => doc.id !== id)
      );
      message.success('Document deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete document');
    }
  });

  // Filter documents based on various criteria
  const filteredDocuments = documents.filter(doc => {
    // Apply employee filter
    if (selectedEmployee !== 'All' && doc.employeeId !== selectedEmployee) {
      return false;
    }
    
    // Apply status filter
    if (selectedStatus !== 'All' && doc.status !== selectedStatus) {
      return false;
    }
    
    // Apply tab filter
    if (activeTab !== 'all' && doc.status !== activeTab) {
      return false;
    }
    
    // Apply other filters
    if (filters.documentType && doc.documentType !== filters.documentType) {
      return false;
    }
    
    if (filters.category && doc.category !== filters.category) {
      return false;
    }
    
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const docDate = new Date(doc.uploadDate);
      if (docDate < filters.dateRange[0]!.toDate() || docDate > filters.dateRange[1]!.toDate()) {
        return false;
      }
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!doc.employeeName.toLowerCase().includes(query) &&
          !doc.fileName.toLowerCase().includes(query) &&
          !doc.documentType.toLowerCase().includes(query) &&
          !doc.category.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  // Event handlers
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddDocument = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsAddModalVisible(true);
    form.setFieldsValue({
      ...document,
      employeeId: document.employeeId,
      uploadDate: dayjs(document.uploadDate)
    });
  };

  const handleDeleteDocument = (id: string) => {
    modal.confirm({
      title: 'Delete Document',
      content: 'Are you sure you want to delete this document? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteDocumentMutation.mutate(id);
      }
    });
  };

  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewModalVisible(true);
  };

  const handleFormSubmit = (values: DocumentFormValues) => {
    const documentData = {
      ...values,
      id: selectedDocument?.id || Date.now().toString(),
      employeeName: employees.find(e => e.id === values.employeeId)?.name || '',
      uploadDate: values.uploadDate ? values.uploadDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      status: selectedDocument?.status || 'Pending',
      fileSize: selectedDocument?.fileSize || '1.5 MB',
      versions: selectedDocument?.versions || [
        { 
          version: 1, 
          uploadDate: dayjs().format('YYYY-MM-DD'), 
          uploadedBy: 'HR Admin', 
          changes: 'Initial upload' 
        }
      ]
    };

    if (selectedDocument) {
      updateDocumentMutation.mutate(documentData as Document);
    } else {
      addDocumentMutation.mutate(documentData as Document);
    }

    setIsAddModalVisible(false);
    form.resetFields();
    setSelectedDocument(null);
  };

  const handleBulkUpload = (info: any) => {
    // Simulate bulk upload
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one document to delete');
      return;
    }

    modal.confirm({
      title: 'Delete Selected Documents',
      content: `Are you sure you want to delete ${selectedRowKeys.length} documents? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        selectedRowKeys.forEach(id => deleteDocumentMutation.mutate(id as string));
        setSelectedRowKeys([]);
      }
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || 'default';
    return fileTypeIcons[extension] || fileTypeIcons.default;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Table columns
  const columns: any = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      responsive: ['md'],
      render: (text: string, record: Document) => (
        <Space>
          <Avatar size="small" icon={<User size={16} color={token.colorPrimary} />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {employees.find(e => e.id === record.employeeId)?.department}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
      responsive: ['sm'],
      render: (type: string) => {
        const docType = documentTypes.find(t => t.name === type);
        return (
          <Space>
            {docType?.icon || <FileArchive size={16} color={token.colorTextSecondary} />}
            {type}
          </Space>
        );
      },
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          {getFileIcon(text)}
          <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 150 }}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['lg'],
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      responsive: ['md'],
      render: (date: string) => (
        <Space>
          <Calendar size={16} color={token.colorTextSecondary} />
          {dayjs(date).format('MMM D, YYYY')}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['sm'],
      render: (status: string) => (
        <Tag icon={statusIcons[status]} color={statusColors[status]}>
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
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
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
          </Button>
        ]}
      />

      <FilterCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={6}>
            <Input
              placeholder="Search documents..."
              prefix={<Search size={16} />}
              onChange={e => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Dropdown
              menu={{
                items: [
                  { key: 'All', label: 'All Employees' },
                  ...employees.map(emp => ({ key: emp.id, label: emp.name }))
                ],
                onClick: ({ key }) => setSelectedEmployee(key)
              }}
              trigger={['click']}
            >
              <Button block>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Employee: {selectedEmployee === 'All' ? 'All' : employees.find(e => e.id === selectedEmployee)?.name}
                </span>
                <ChevronDown size={14} style={{ marginLeft: 8 }} />
              </Button>
            </Dropdown>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Dropdown
              menu={{
                items: [
                  { key: 'All', label: 'All Statuses' },
                  { key: 'Approved', label: 'Approved' },
                  { key: 'Pending', label: 'Pending' },
                  { key: 'Rejected', label: 'Rejected' }
                ],
                onClick: ({ key }) => setSelectedStatus(key)
              }}
              trigger={['click']}
            >
              <Button block>
                Status: {selectedStatus}
                <ChevronDown size={14} style={{ marginLeft: 8 }} />
              </Button>
            </Dropdown>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Select
              placeholder="Document Type"
              style={{ width: '100%' }}
              allowClear
              onChange={value => handleFilterChange('documentType', value)}
              options={documentTypes.map(type => ({
                value: type.name,
                label: (
                  <Space>
                    {type.icon}
                    {type.name}
                  </Space>
                )
              }))}
            />
          </Col>
          <Col xs={24} lg={4} style={{ textAlign: 'right' }}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Button
                  icon={<Trash2 size={16} />}
                  danger
                  onClick={handleBulkDelete}
                >
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </FilterCard>

      <DocumentCard>
        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: (
                <span>
                  {tabIcons.all}
                  All Documents
                </span>
              ),
            },
            {
              key: 'Approved',
              label: (
                <span>
                  {tabIcons.Approved}
                  Approved
                </span>
              ),
            },
            {
              key: 'Pending',
              label: (
                <span>
                  {tabIcons.Pending}
                  Pending
                </span>
              ),
            },
            {
              key: 'Rejected',
              label: (
                <span>
                  {tabIcons.Rejected}
                  Rejected
                </span>
              ),
            },
          ]}
        />

        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            pageSize: 5,
            responsive: true,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          scroll={{ x: true }}
        />
      </DocumentCard>

      <DocumentModal
        visible={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setSelectedDocument(null);
        }}
        onSubmit={handleFormSubmit}
        form={form}
        selectedDocument={selectedDocument}
        mockEmployees={employees}
        mockDocumentTypes={documentTypes}
        mockCategories={categories}
      />

      <DocumentPreviewModal
        visible={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        onEdit={() => {
          setIsPreviewModalVisible(false);
          setIsAddModalVisible(true);
        }}
        document={selectedDocument}
        mockEmployees={employees}
        mockDocumentTypes={documentTypes}
        getFileIcon={getFileIcon}
        statusColors={statusColors}
        statusIcons={statusIcons}
      />

      <BulkUploadModal
        visible={isBulkUploadVisible}
        onCancel={() => setIsBulkUploadVisible(false)}
        onUpload={handleBulkUpload}
      />
    </Container>
  );
};

export default DocumentManagement;