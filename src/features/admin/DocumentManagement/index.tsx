import React, { useState, useEffect } from 'react';
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
  Menu,
  message,
  Typography,
  Tooltip,
  Avatar,
  Tabs
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
  FileArchive
} from 'lucide-react';
import dayjs from 'dayjs';
import HeaderComponent from '../../../components/PageHeader';
import DocumentModal from './components/DocumentModal';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import BulkUploadModal from './components/BulkUploadModal';
import { Container, FilterCard, DocumentCard } from './styles';
import {
  Employee,
  Document,
  DocumentType,
  FilterOptions,
  DocumentFormValues
} from './types';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock data and constants

const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', department: 'Engineering', email: 'john.doe@company.com' },
  { id: '2', name: 'Jane Smith', department: 'Marketing', email: 'jane.smith@company.com' },
  { id: '3', name: 'Robert Johnson', department: 'Sales', email: 'robert.johnson@company.com' },
  { id: '4', name: 'Emily Davis', department: 'Engineering', email: 'emily.davis@company.com' },
  { id: '5', name: 'Michael Wilson', department: 'HR', email: 'michael.wilson@company.com' },
];

const mockDocumentTypes: DocumentType[] = [
  { id: '1', name: 'Resume', icon: <FileText size={16} />, required: true },
  { id: '2', name: 'Contract', icon: <File size={16} />, required: true },
  { id: '3', name: 'ID Proof', icon: <FileText size={16} />, required: true },
  { id: '4', name: 'Offer Letter', icon: <FileText size={16} />, required: false },
  { id: '5', name: 'NDA', icon: <File size={16} />, required: false },
  { id: '6', name: 'Training Certificate', icon: <FileText size={16} />, required: false },
  { id: '7', name: 'Performance Review', icon: <File size={16} />, required: false },
];

const mockCategories = [
  'Employment',
  'Legal',
  'Training',
  'Performance',
  'Benefits',
  'Miscellaneous'
];

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

// Status colors
const statusColors: Record<string, string> = {
  Approved: 'green',
  Pending: 'orange',
  Rejected: 'red'
};

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle size={16} />,
  Pending: <Clock size={16} />,
  Rejected: <XCircle size={16} />
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
  'default': <File size={16} />
};

// Main Component
const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
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

  // Apply filters and search
  useEffect(() => {
    let result = documents;
    
    // Apply filters
    if (filters.employee) {
      result = result.filter(doc => doc.employeeId === filters.employee);
    }
    
    if (filters.documentType) {
      result = result.filter(doc => doc.documentType === filters.documentType);
    }
    
    if (filters.status) {
      result = result.filter(doc => doc.status === filters.status);
    }
    
    if (filters.category) {
      result = result.filter(doc => doc.category === filters.category);
    }
    
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter(doc => {
        const docDate = new Date(doc.uploadDate);
        return docDate >= filters.dateRange[0]!.toDate() && 
               docDate <= filters.dateRange[1]!.toDate();
      });
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.employeeName.toLowerCase().includes(query) ||
        doc.fileName.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query)
      );
    }
    
    // Apply employee filter from dropdown
    if (selectedEmployee !== 'All') {
      result = result.filter(doc => doc.employeeId === selectedEmployee);
    }
    
    // Apply status filter from dropdown
    if (selectedStatus !== 'All') {
      result = result.filter(doc => doc.status === selectedStatus);
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      result = result.filter(doc => doc.status === activeTab);
    }
    
    setFilteredDocuments(result);
  }, [filters, searchQuery, documents, selectedEmployee, selectedStatus, activeTab]);

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
      uploadDate: dayjs(document.uploadDate).format('YYYY-MM-DD')
    });
  };

  const handleDeleteDocument = (id: string) => {
    Modal.confirm({
      title: 'Delete Document',
      content: 'Are you sure you want to delete this document? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        message.success('Document deleted successfully');
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
      employeeName: mockEmployees.find(e => e.id === values.employeeId)?.name || '',
      uploadDate: values.uploadDate ? values.uploadDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
      status: 'Pending',
      fileSize: '1.5 MB', // This would come from the actual file in a real app
      versions: [
        { version: 1, uploadDate: new Date().toISOString().split('T')[0], uploadedBy: 'HR Admin', changes: 'Initial upload' }
      ]
    };

    if (selectedDocument) {
      // Update existing document
      setDocuments((prev: any) => prev.map((doc: any) => doc.id === selectedDocument.id ? 
        { ...doc, ...documentData } : doc));
      message.success('Document updated successfully');
    } else {
      // Add new document
      const newDocument: any = {
        ...documentData,
        id: Date.now().toString(),
      };
      setDocuments(prev => [...prev, newDocument]);
      message.success('Document added successfully');
    }
    
    setIsAddModalVisible(false);
    form.resetFields();
    setSelectedDocument(null);
  };

  const handleBulkUpload = (info: any) => {
    // Simulate bulk upload
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // In a real app, you would process the uploaded files
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one document to delete');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Documents',
      content: `Are you sure you want to delete ${selectedRowKeys.length} documents? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setDocuments(prev => prev.filter(doc => !selectedRowKeys.includes(doc.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} documents deleted successfully`);
      }
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || 'default';
    return fileTypeIcons[extension] || fileTypeIcons.default;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const employeeMenu = (
    <Menu onClick={({ key }) => setSelectedEmployee(key)}>
      <Menu.Item key="All">All Employees</Menu.Item>
      {mockEmployees.map(emp => (
        <Menu.Item key={emp.id}>{emp.name}</Menu.Item>
      ))}
    </Menu>
  );

  const statusMenu = (
    <Menu onClick={({ key }) => setSelectedStatus(key)}>
      <Menu.Item key="All">All Statuses</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="Pending">Pending</Menu.Item>
      <Menu.Item key="Rejected">Rejected</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string, record: Document) => (
        <Space>
          <Avatar size="small" icon={<User size={16} />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {mockEmployees.find(e => e.id === record.employeeId)?.department}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
      render: (type: string) => (
        <Space>
          {mockDocumentTypes.find(t => t.name === type)?.icon || <FileArchive />}
          {type}
        </Space>
      ),
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
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => (
        <Space>
          <Calendar size={16} />
          {new Date(date).toLocaleDateString()}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Search documents..."
              prefix={<Search size={16} />}
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Dropdown overlay={employeeMenu} trigger={['click']}>
              <Button>
                Employee: {selectedEmployee === 'All' ? 'All' : mockEmployees.find(e => e.id === selectedEmployee)?.name} 
                <ChevronDown size={14} style={{ marginLeft: 8 }} />
              </Button>
            </Dropdown>
          </Col>
          <Col span={4}>
            <Dropdown overlay={statusMenu} trigger={['click']}>
              <Button>
                Status: {selectedStatus} 
                <ChevronDown size={14} style={{ marginLeft: 8 }} />
              </Button>
            </Dropdown>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Document Type"
              style={{ width: '100%' }}
              allowClear
              onChange={value => handleFilterChange('documentType', value)}
            >
              {mockDocumentTypes.map(type => (
                <Option key={type.id} value={type.name}>{type.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
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
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: 16 }}
        >
          <TabPane tab="All Documents" key="all" />
          <TabPane tab="Approved" key="Approved" />
          <TabPane tab="Pending" key="Pending" />
          <TabPane tab="Rejected" key="Rejected" />
        </Tabs>
        
        <Table 
          columns={columns} 
          dataSource={filteredDocuments} 
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{ pageSize: 5 }}
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
        mockEmployees={mockEmployees}
        mockDocumentTypes={mockDocumentTypes}
        mockCategories={mockCategories}
      />
      
      <DocumentPreviewModal
        visible={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        onEdit={() => {
          setIsPreviewModalVisible(false);
          setIsAddModalVisible(true);
        }}
        document={selectedDocument}
        mockEmployees={mockEmployees}
        mockDocumentTypes={mockDocumentTypes}
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