import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Badge,
  Alert,
  Row,
  Col,
  Statistic,
  Divider,
  Space,
  Typography,
  Switch,
  theme,
  Upload,
  Progress,
  List,
  Tabs,
  Dropdown,
  Breadcrumb,
  Avatar
} from 'antd';
import {
  FileText,
  FileImage,
  File,
  Download,
  Trash2,
  Share2,
  Upload as UploadIcon,
  Plus,
  ZoomIn,
  Printer,
  Folder,
  FolderOpen,
  History,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Lock,
  Users,
  FileDigit
} from 'lucide-react';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { useToken } = theme;
const { Dragger } = Upload;

// Sample data for demonstration
const mockDocumentsData: any = [
  {
    id: 1,
    name: 'Employment Contract.pdf',
    type: 'pdf',
    category: 'Employment',
    uploadDate: '2023-05-15',
    status: 'Approved',
    size: '2.4 MB',
    sharedWith: ['HR Department'],
    isImportant: true,
    isPrivate: true,
    versions: 2
  },
  {
    id: 2,
    name: 'ID Document.jpg',
    type: 'image',
    category: 'Personal',
    uploadDate: '2023-06-20',
    status: 'Approved',
    size: '1.2 MB',
    sharedWith: ['HR Department'],
    isImportant: true,
    isPrivate: true,
    versions: 1
  },
  {
    id: 3,
    name: 'Training Certificate.pdf',
    type: 'pdf',
    category: 'Training',
    uploadDate: '2023-07-10',
    status: 'Approved',
    size: '0.8 MB',
    sharedWith: ['Manager'],
    isImportant: false,
    isPrivate: false,
    versions: 1
  },
  {
    id: 4,
    name: 'Expense Report.xlsx',
    type: 'excel',
    category: 'Finance',
    uploadDate: '2023-08-05',
    status: 'Pending Review',
    size: '0.5 MB',
    sharedWith: ['Finance Department'],
    isImportant: false,
    isPrivate: false,
    versions: 1
  },
  {
    id: 5,
    name: 'Company Policy Handbook.pdf',
    type: 'pdf',
    category: 'Policies',
    uploadDate: '2023-01-15',
    status: 'Approved',
    size: '5.7 MB',
    sharedWith: ['All Employees'],
    isImportant: true,
    isPrivate: false,
    versions: 3
  },
  {
    id: 6,
    name: 'Performance Review.docx',
    type: 'word',
    category: 'HR',
    uploadDate: '2023-09-12',
    status: 'Rejected',
    size: '0.3 MB',
    sharedWith: ['HR Department'],
    isImportant: false,
    isPrivate: true,
    versions: 1
  }
];

const mockCategories: any = [
  { name: 'All Documents', count: 28, icon: <FolderOpen size={16} /> },
  { name: 'Personal', count: 5, icon: <Lock size={16} /> },
  { name: 'Employment', count: 3, icon: <FileText size={16} /> },
  { name: 'HR', count: 7, icon: <Users size={16} /> },
  { name: 'Finance', count: 4, icon: <FileDigit size={16} /> },
  { name: 'Training', count: 6, icon: <History size={16} /> },
  { name: 'Policies', count: 3, icon: <History size={16} /> }
];

const mockSharedDocuments: any = [
  {
    id: 101,
    name: 'Team Meeting Notes.docx',
    sharedBy: 'Sarah Johnson',
    sharedDate: '2023-09-15',
    type: 'word'
  },
  {
    id: 102,
    name: 'Project Timeline.pdf',
    sharedBy: 'Michael Chen',
    sharedDate: '2023-09-10',
    type: 'pdf'
  },
  {
    id: 103,
    name: 'Company Event Photos.zip',
    sharedBy: 'HR Department',
    sharedDate: '2023-09-05',
    type: 'archive'
  }
];

// Document Dashboard Component
const DocumentDashboard = ({ darkMode, toggleDarkMode }: any) => {
  const { token } = useToken();



  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Recent Documents" style={{ marginBottom: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={mockDocumentsData.slice(0, 3)}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button key="view" type="text" icon={<Eye size={16} />} />,
                    <Button key="download" type="text" icon={<Download size={16} />} />
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getDocumentIcon(item.type)}
                        style={{ backgroundColor: getDocumentColor(item.type) }}
                      />
                    }
                    title={<Text ellipsis>{item.name}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{formatFileSize(item.size)}</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">{new Date(item.uploadDate).toLocaleDateString()}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <SharedDocuments />
        </Col>
      </Row>
    </>
  );
};

// Documents Table Component
const DocumentsTable = ({ onViewDocument, onShareDocument, onDeleteDocument, currentCategory }: any) => {
  const [filteredData, setFilteredData] = useState(mockDocumentsData);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (name: any, record: any) => (
        <Space>
          <Avatar
            icon={getDocumentIcon(record.type)}
            style={{ backgroundColor: getDocumentColor(record.type) }}
          />
          <Text>{name}</Text>
          {record.isImportant && <Star size={14} color="#faad14" fill="#faad14" />}
          {record.isPrivate && <Lock size={14} />}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: any) => (
        <Tag color={getDocumentColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'PDF', value: 'pdf' },
        { text: 'Image', value: 'image' },
        { text: 'Word', value: 'word' },
        { text: 'Excel', value: 'excel' },
      ],
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Personal', value: 'Personal' },
        { text: 'Employment', value: 'Employment' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Training', value: 'Training' },
        { text: 'Policies', value: 'Policies' },
      ],
      onFilter: (value: any, record: any) => record.category === value,
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: any) => new Date(date).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.uploadDate).getDate() - new Date(b.uploadDate).getDate(),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      sorter: (a: any, b: any) => {
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeA - sizeB;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color, icon;
        switch (status) {
          case 'Approved':
            color = 'green';
            icon = <CheckCircle size={14} />;
            break;
          case 'Pending Review':
            color = 'orange';
            icon = <Clock size={14} />;
            break;
          case 'Rejected':
            color = 'red';
            icon = <XCircle size={14} />;
            break;
          default: color = 'default';
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: 'Approved', value: 'Approved' },
        { text: 'Pending Review', value: 'Pending Review' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<Eye size={16} />}
            onClick={() => onViewDocument(record)}
          >
            View
          </Button>
          <Button
            icon={<Download size={16} />}
          >
            Download
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'share',
                  label: 'Share',
                  icon: <Share2 size={16} />,
                  onClick: () => onShareDocument(record)
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <Trash2 size={16} />,
                  onClick: () => onDeleteDocument(record),
                  danger: true
                }
              ]
            }}
            placement="bottomRight"
          >
            <Button icon={<MoreVertical size={16} />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    let result = mockDocumentsData;

    // Apply category filter
    if (currentCategory && currentCategory !== 'All Documents') {
      result = result.filter((doc: any) => doc.category === currentCategory);
    }

    // Apply search filter
    if (searchText) {
      result = result.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((item: any) => item.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter((item: any) => item.type === typeFilter);
    }

    setFilteredData(result);
  }, [searchText, statusFilter, typeFilter, currentCategory]);

  return (
    <Card
      title="My Documents"
      extra={
        <Space>
          <Input
            placeholder="Search documents..."
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            allowClear
            onClear={() => setStatusFilter('all')}
          >
            <Option value="all">All Statuses</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Pending Review">Pending</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
          <Select
            placeholder="Filter by type"
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 150 }}
            allowClear
            onClear={() => setTypeFilter('all')}
          >
            <Option value="all">All Types</Option>
            <Option value="pdf">PDF</Option>
            <Option value="image">Image</Option>
            <Option value="word">Word</Option>
            <Option value="excel">Excel</Option>
          </Select>
          <Button icon={<Filter size={16} />}>
            More Filters
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

// Document Upload Panel Component
const DocumentUploadPanel = ({ visible, onClose, onUpload }: any) => {
  const [fileList, setFileList] = useState<any>([]);
  const [uploading, setUploading] = useState<any>(false);

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      onUpload(fileList);
      setFileList([]);
      onClose();
    }, 2000);
  };

  const props: any = {
    onRemove: (file: any) => {
      const index: any = fileList.indexOf(file);
      const newFileList: any = fileList.slice();
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
      title="Upload Documents"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          icon={<UploadIcon size={16} />}
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Start Upload'}
        </Button>
      ]}
      width={600}
    >
      <Dragger {...props} multiple>
        <p className="ant-upload-drag-icon">
          <UploadIcon size={48} />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Support for single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>

      <Divider />

      <Form layout="vertical">
        <Form.Item label="Category">
          <Select placeholder="Select a category">
            <Option value="Personal">Personal</Option>
            <Option value="Employment">Employment</Option>
            <Option value="HR">HR</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Training">Training</Option>
            <Option value="Policies">Policies</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Visibility">
          <Select defaultValue="private" placeholder="Select visibility">
            <Option value="private">Private (Only me)</Option>
            <Option value="hr">HR Department</Option>
            <Option value="manager">My Manager</Option>
            <Option value="team">My Team</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Document Preview Modal Component
const DocumentPreviewModal = ({ document, visible, onClose }: any) => {
  if (!document) return null;

  return (
    <Modal
      title={document.name}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" icon={<Download size={16} />}>
          Download
        </Button>,
        <Button key="print" icon={<Printer size={16} />}>
          Print
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Avatar
          size={64}
          icon={getDocumentIcon(document.type)}
          style={{ backgroundColor: getDocumentColor(document.type) }}
        />
        <Title level={4} style={{ marginTop: 16 }}>{document.name}</Title>

        <Row gutter={16} style={{ marginTop: 24, textAlign: 'left' }}>
          <Col span={12}>
            <p><Text strong>Type:</Text> {document.type.toUpperCase()}</p>
            <p><Text strong>Category:</Text> {document.category}</p>
            <p><Text strong>Size:</Text> {document.size}</p>
          </Col>
          <Col span={12}>
            <p><Text strong>Upload Date:</Text> {new Date(document.uploadDate).toLocaleDateString()}</p>
            <p><Text strong>Status:</Text>
              <Tag color={document.status === 'Approved' ? 'green' : document.status === 'Pending Review' ? 'orange' : 'red'} style={{ marginLeft: 8 }}>
                {document.status}
              </Tag>
            </p>
            <p><Text strong>Shared with:</Text> {document.sharedWith.join(', ')}</p>
          </Col>
        </Row>

        <Divider />

        <div style={{
          height: 400,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8
        }}>
          <div>
            <FileText size={64} />
            <p>Document preview would appear here</p>
            <p>For PDFs, images, and other supported formats</p>
          </div>
        </div>

        {document.versions > 1 && (
          <>
            <Divider />
            <Button icon={<History size={16} />}>View Version History ({document.versions})</Button>
          </>
        )}
      </div>
    </Modal>
  );
};

// Document Categories Component
const DocumentCategories = ({ currentCategory, onCategoryChange }: any) => {
  return (
    <Card title="Categories" style={{ marginBottom: 24 }}>
      <List
        itemLayout="horizontal"
        dataSource={mockCategories}
        renderItem={(item: any) => (
          <List.Item
            style={{
              cursor: 'pointer',
              backgroundColor: currentCategory === item.name ? '#f0f7ff' : 'transparent'
            }}
            onClick={() => onCategoryChange(item.name)}
          >
            <List.Item.Meta
              avatar={item.icon}
              title={item.name}
              description={`${item.count} documents`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

// Shared Documents Component
const SharedDocuments = () => {
  return (
    <Card title="Shared With Me" style={{ marginBottom: 16 }} >
      <List
        itemLayout="horizontal"
        dataSource={mockSharedDocuments}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button key="download" icon={<Download size={16} />} />,
              <Button key="view" icon={<Eye size={16} />} />
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={getDocumentIcon(item.type)}
                  style={{ backgroundColor: getDocumentColor(item.type) }}
                />
              }
              title={item.name}
              description={
                <Space direction="vertical" size="small">
                  <Text>Shared by {item.sharedBy}</Text>
                  <Text type="secondary">on {new Date(item.sharedDate).toLocaleDateString()}</Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

// Helper functions
function getDocumentIcon(type: any) {
  switch (type) {
    case 'pdf': return <History />;
    case 'image': return <FileImage />;
    case 'word': return <FileText />;
    case 'excel': return <FileDigit />;
    default: return <File />;
  }
}

function getDocumentColor(type: any) {
  switch (type) {
    case 'pdf': return '#f50';
    case 'image': return '#87d068';
    case 'word': return '#1890ff';
    case 'excel': return '#52c41a';
    default: return '#d4d4d4';
  }
}

function formatFileSize(size: any) {
  return size; // In a real app, you would format this properly
}

// Main EmployeeDocuments Component
const EmployeeDocuments = () => {
  const { isDarkMode } = useTheme();
  const { token } = useToken();
  const [darkMode, setDarkMode] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<any>(false);
  const [previewModalVisible, setPreviewModalVisible] = useState<any>(false);
  const [shareModalVisible, setShareModalVisible] = useState<any>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<any>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentCategory, setCurrentCategory] = useState<any>('All Documents');
  const totalDocuments = mockDocumentsData.length;
  const approvedDocuments = mockDocumentsData.filter((doc: any) => doc.status === 'Approved').length;
  const pendingDocuments = mockDocumentsData.filter((doc: any) => doc.status === 'Pending Review').length;
  const sharedDocuments = mockSharedDocuments.length;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setPreviewModalVisible(true);
  };

  const handleShareDocument = (document: any) => {
    setSelectedDocument(document);
    setShareModalVisible(true);
  };

  const handleDeleteDocument = (document: any) => {
    setSelectedDocument(document);
    setDeleteModalVisible(true);
  };

  const handleUpload = (files: any) => {
    // In a real app, this would make an API call
    console.log('Files uploaded:', files);
    // Show success message
  };

  const handleShare = (shareData: any) => {
    // In a real app, this would make an API call
    console.log('Document shared:', shareData);
    // Show success message
  };

  const handleDelete = () => {
    // In a real app, this would make an API call
    console.log('Document deleted:', selectedDocument);
    setDeleteModalVisible(false);
    // Show success message
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Document Management"
        subtitle="Manage your all Documents"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
      />
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={totalDocuments}
              prefix={<FileText size={20} color={token.colorPrimary} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={approvedDocuments}
              prefix={<CheckCircle size={20} color={token.colorSuccess} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Review"
              value={pendingDocuments}
              prefix={<Clock size={20} color={token.colorWarning} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Shared With Me"
              value={sharedDocuments}
              prefix={<Users size={20} color={token.colorInfo} />}
            />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col xs={24} lg={18}>
          <DocumentsTable
            onViewDocument={handleViewDocument}
            onShareDocument={handleShareDocument}
            onDeleteDocument={handleDeleteDocument}
            currentCategory={currentCategory}
          />
          <Divider />
          <DocumentDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Col>
        <Col xs={24} lg={6}>
          <DocumentCategories
            currentCategory={currentCategory}
            onCategoryChange={setCurrentCategory}
          />
          <Button
            type="primary"
            icon={<Plus size={16} />}
            block
            onClick={() => setUploadModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Upload Document
          </Button>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button icon={<Download size={16} />} block>Download All</Button>
              <Button icon={<Share2 size={16} />} block>Share Folder</Button>
              <Button icon={<History size={16} />} block>Recent Activity</Button>
            </Space>
          </Card>
        </Col>
      </Row>
      <DocumentUploadPanel
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
      />
      <DocumentPreviewModal
        document={selectedDocument}
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
      />
      <Modal
        title="Share Document"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setShareModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="share" type="primary" icon={<Share2 size={16} />}>
            Share Document
          </Button>
        ]}
      >
        {selectedDocument && (
          <Form layout="vertical">
            <Form.Item label="Document">
              <Input value={selectedDocument.name} disabled />
            </Form.Item>

            <Form.Item label="Share with" required>
              <Select mode="multiple" placeholder="Select people or departments">
                <Option value="hr">HR Department</Option>
                <Option value="manager">My Manager</Option>
                <Option value="team">My Team</Option>
                <Option value="finance">Finance Department</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Permission">
              <Select defaultValue="view">
                <Option value="view">Can view</Option>
                <Option value="comment">Can comment</Option>
                <Option value="edit">Can edit</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Message (optional)">
              <Input.TextArea placeholder="Add a message to recipients..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="Delete Document"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
        ]}
      >
        {selectedDocument && (
          <div>
            <p>Are you sure you want to delete <Text strong>{selectedDocument.name}</Text>?</p>
            <p>This action cannot be undone.</p>
          </div>
        )}
      </Modal>
    </Wrapper >
  );
};

export default EmployeeDocuments;