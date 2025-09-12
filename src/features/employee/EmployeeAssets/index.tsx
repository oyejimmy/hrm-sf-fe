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
  InputNumber
} from 'antd';
import {
  Laptop,
  Monitor,
  Package,
  List,
  Filter,
  Info,
  History,
  PlusCircle,
  Send,
  MinusCircle,
  CornerDownLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  Calendar,
  User,
  Building,
  Smartphone,
  Headphones,
  Server,
  Printer
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { useToken } = theme;

// Sample data for demonstration
const mockAssetsData = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    serialNumber: 'SN-MBP-2023-001',
    assignmentDate: '2023-05-15',
    status: 'Assigned',
    specifications: 'M2 Pro, 32GB RAM, 1TB SSD',
    custodian: 'John Smith',
    department: 'Engineering'
  },
  {
    id: 2,
    name: 'Dell UltraSharp 27"',
    type: 'Monitor',
    serialNumber: 'SN-DELL-2023-045',
    assignmentDate: '2023-06-20',
    status: 'Assigned',
    specifications: '4K UHD, IPS Panel',
    custodian: 'John Smith',
    department: 'Engineering'
  },
  {
    id: 3,
    name: 'iPhone 14 Pro',
    type: 'Phone',
    serialNumber: 'SN-APPLE-2023-078',
    assignmentDate: null,
    status: 'Available',
    specifications: '128GB, Deep Purple',
    custodian: null,
    department: null
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    type: 'Headphones',
    serialNumber: 'SN-SONY-2023-112',
    assignmentDate: '2023-07-10',
    status: 'Assigned',
    specifications: 'Noise Cancelling, Black',
    custodian: 'Sarah Johnson',
    department: 'Design'
  },
  {
    id: 5,
    name: 'HP LaserJet Pro',
    type: 'Printer',
    serialNumber: 'SN-HP-2022-987',
    assignmentDate: null,
    status: 'Maintenance',
    specifications: 'MFP 4301fdw',
    custodian: null,
    department: 'Office'
  },
  {
    id: 6,
    name: 'Lenovo ThinkPad X1',
    type: 'Laptop',
    serialNumber: 'SN-LENOVO-2023-203',
    assignmentDate: null,
    status: 'Available',
    specifications: 'i7, 16GB RAM, 512GB SSD',
    custodian: null,
    department: null
  }
];

const mockRequests = [
  {
    id: 1,
    assetName: 'MacBook Pro 16"',
    type: 'Laptop',
    requestDate: '2023-05-10',
    status: 'Approved'
  },
  {
    id: 2,
    assetName: 'Sony Headphones',
    type: 'Headphones',
    requestDate: '2023-07-05',
    status: 'Pending'
  }
];

// Asset Dashboard Component
const AssetDashboard = ({ isDarkMode, toggleDarkMode }: any) => {
  const { token } = useToken();

  const totalAssets = mockAssetsData.length;
  const assignedAssets = mockAssetsData.filter(asset => asset.status === 'Assigned').length;
  const availableAssets = mockAssetsData.filter(asset => asset.status === 'Available').length;
  const pendingRequests = mockRequests.filter(request => request.status === 'Pending').length;

  return (<>
    <HeaderComponent
      isDarkMode={isDarkMode}
      title="Asset Management "
      subtitle="Manage your Assets"
      breadcrumbItems={[
        {
          title: 'Home',
          href: '/'
        },
      ]}
    />
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Assets"
            value={totalAssets}
            prefix={<Package size={20} color={token.colorPrimary} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Assigned to Me"
            value={assignedAssets}
            prefix={<User size={20} color={token.colorSuccess} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Available Assets"
            value={availableAssets}
            prefix={<CheckCircle size={20} color={token.colorInfo} />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Pending Requests"
            value={pendingRequests}
            prefix={<AlertTriangle size={20} color={token.colorWarning} />}
          />
        </Card>
      </Col>
    </Row>

    <Divider />

    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Card title="Asset Distribution by Type" style={{ height: 300 }}>
          {/* Placeholder for chart - in a real app, you would use a charting library */}
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Laptop size={40} style={{ margin: 10 }} />
            <Monitor size={40} style={{ margin: 10 }} />
            <Smartphone size={40} style={{ margin: 10 }} />
            <Headphones size={40} style={{ margin: 10 }} />
            <Printer size={40} style={{ margin: 10 }} />
            <Text>Asset type distribution chart would appear here</Text>
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Recent Activity" style={{ height: 300 }}>
          {/* Placeholder for activity timeline */}
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>MacBook Pro 16" assigned</Text>
              <br />
              <Text type="secondary">2 days ago</Text>
            </div>
            <div>
              <Text strong>Monitor return requested</Text>
              <br />
              <Text type="secondary">5 days ago</Text>
            </div>
            <div>
              <Text strong>Headphones request approved</Text>
              <br />
              <Text type="secondary">1 week ago</Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  </>
  );
};

// Asset Table Component
const AssetTable = ({ onViewDetails, onRequestAsset, onReturnAsset }: any) => {
  const [filteredData, setFilteredData] = useState(mockAssetsData);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns: any = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: any) => {
        const iconProps = { size: 16, style: { marginRight: 8 } };
        let icon;
        switch (type) {
          case 'Laptop': icon = <Laptop {...iconProps} />; break;
          case 'Monitor': icon = <Monitor {...iconProps} />; break;
          case 'Phone': icon = <Smartphone {...iconProps} />; break;
          case 'Headphones': icon = <Headphones {...iconProps} />; break;
          case 'Printer': icon = <Printer {...iconProps} />; break;
          case 'Server': icon = <Server {...iconProps} />; break;
          default: icon = <Package {...iconProps} />;
        }
        return <>{icon} {type}</>;
      },
      filters: [
        { text: 'Laptop', value: 'Laptop' },
        { text: 'Monitor', value: 'Monitor' },
        { text: 'Phone', value: 'Phone' },
        { text: 'Headphones', value: 'Headphones' },
        { text: 'Printer', value: 'Printer' },
      ],
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Assignment Date',
      dataIndex: 'assignmentDate',
      key: 'assignmentDate',
      render: (date: any) => date ? new Date(date).toLocaleDateString() : 'Not assigned',
      sorter: (a: any, b: any) => new Date(a.assignmentDate || 0).getTime() - new Date(b.assignmentDate || 0).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color;
        switch (status) {
          case 'Assigned': color = 'green'; break;
          case 'Available': color = 'blue'; break;
          case 'Maintenance': color = 'orange'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Assigned', value: 'Assigned' },
        { text: 'Available', value: 'Available' },
        { text: 'Maintenance', value: 'Maintenance' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<Info size={16} />}
            onClick={() => onViewDetails(record)}
          >
            Details
          </Button>
          {record.status === 'Available' && (
            <Button
              type="primary"
              icon={<PlusCircle size={16} />}
              onClick={() => onRequestAsset(record)}
            >
              Request
            </Button>
          )}
          {record.status === 'Assigned' && record.custodian === 'John Smith' && (
            <Button
              danger
              icon={<MinusCircle size={16} />}
              onClick={() => onReturnAsset(record)}
            >
              Return
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    let result = mockAssetsData;

    // Apply search filter
    if (searchText) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    setFilteredData(result);
  }, [searchText, statusFilter]);

  return (
    <Card
      title="Asset Inventory"
      extra={
        <Space>
          <Input
            placeholder="Search assets..."
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
            <Option value="Assigned">Assigned</Option>
            <Option value="Available">Available</Option>
            <Option value="Maintenance">Maintenance</Option>
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

// Asset Details Modal Component
const AssetDetailsModal = ({ asset, visible, onClose }: any) => {
  if (!asset) return null;

  return (
    <Modal
      title="Asset Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={600}
    >
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <div style={{
          width: 100,
          height: 100,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          marginRight: 16
        }}>
          {asset.type === 'Laptop' && <Laptop size={48} />}
          {asset.type === 'Monitor' && <Monitor size={48} />}
          {asset.type === 'Phone' && <Smartphone size={48} />}
          {asset.type === 'Headphones' && <Headphones size={48} />}
          {asset.type === 'Printer' && <Printer size={48} />}
          {!['Laptop', 'Monitor', 'Phone', 'Headphones', 'Printer'].includes(asset.type) &&
            <Package size={48} />}
        </div>
        <div>
          <Title level={4}>{asset.name}</Title>
          <Tag color={asset.status === 'Assigned' ? 'green' : asset.status === 'Available' ? 'blue' : 'orange'}>
            {asset.status}
          </Tag>
        </div>
      </div>

      <Divider />

      <Title level={5}>Specifications</Title>
      <Text>{asset.specifications}</Text>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <Title level={5}>Identification</Title>
          <p><Text strong>Serial Number:</Text> {asset.serialNumber}</p>
          <p><Text strong>Type:</Text> {asset.type}</p>
        </Col>
        <Col span={12}>
          <Title level={5}>Assignment</Title>
          {asset.status === 'Assigned' ? (
            <>
              <p><Text strong>Custodian:</Text> {asset.custodian}</p>
              <p><Text strong>Department:</Text> {asset.department}</p>
              <p><Text strong>Assignment Date:</Text> {new Date(asset.assignmentDate).toLocaleDateString()}</p>
            </>
          ) : (
            <Text>This asset is not currently assigned</Text>
          )}
        </Col>
      </Row>

      <Divider />

      <Title level={5}>History <History size={16} style={{ marginLeft: 8 }} /></Title>
      {/* Placeholder for history timeline */}
      <div style={{ padding: '8px 0' }}>
        <p>• Assigned to John Smith on May 15, 2023</p>
        <p>• Purchased on April 10, 2023</p>
      </div>
    </Modal>
  );
};

// Request Asset Modal Component
const RequestAssetModal = ({ visible, onClose, onRequest, asset }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onRequest({ ...values, asset: asset?.name || values.assetType });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Request Asset"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" icon={<Send size={16} />} onClick={handleSubmit}>
          Submit Request
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          assetType: asset?.type,
          quantity: 1
        }}
      >
        <Form.Item
          name="assetType"
          label="Asset Type"
          rules={[{ required: true, message: 'Please select an asset type' }]}
        >
          <Select placeholder="Select asset type">
            <Option value="Laptop">Laptop</Option>
            <Option value="Monitor">Monitor</Option>
            <Option value="Phone">Phone</Option>
            <Option value="Headphones">Headphones</Option>
            <Option value="Printer">Printer</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        {!asset && (
          <Form.Item
            name="assetName"
            label="Asset Name/Model"
            rules={[{ required: true, message: 'Please specify the asset name or model' }]}
          >
            <Input placeholder="e.g., MacBook Pro 16" />
          </Form.Item>
        )}

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter quantity' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Request"
          rules={[{ required: true, message: 'Please provide a reason for this request' }]}
        >
          <Input.TextArea rows={4} placeholder="Please explain why you need this asset..." />
        </Form.Item>

        <Form.Item
          name="urgency"
          label="Urgency"
          rules={[{ required: true, message: 'Please select urgency level' }]}
        >
          <Select placeholder="How urgent is this request?">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="neededBy"
          label="Needed By"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Return Asset Modal Component
const ReturnAssetModal = ({ visible, onClose, onReturn, asset }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onReturn({ ...values, asset: asset.name });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Return Asset"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" icon={<CornerDownLeft size={16} />} onClick={handleSubmit}>
          Submit Return
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>You are returning <Text strong>{asset?.name}</Text> ({asset?.serialNumber})</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="condition"
          label="Asset Condition"
          rules={[{ required: true, message: 'Please select the asset condition' }]}
        >
          <Select placeholder="How is the asset condition?">
            <Option value="Excellent">Excellent - Like new</Option>
            <Option value="Good">Good - Minor wear</Option>
            <Option value="Fair">Fair - Some issues but functional</Option>
            <Option value="Poor">Poor - Needs repair</Option>
            <Option value="Broken">Broken - Not functional</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Return"
          rules={[{ required: true, message: 'Please provide a reason for returning this asset' }]}
        >
          <Input.TextArea rows={4} placeholder="Why are you returning this asset?" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <Input.TextArea rows={3} placeholder="Any additional information about the asset's condition or return..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Asset Alerts Component
const AssetAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Your monitor assignment is overdue for return by 5 days',
      asset: 'Dell UltraSharp 27"',
      date: '2023-06-20'
    },
    {
      id: 2,
      type: 'info',
      message: 'New laptop models are available for request',
      action: 'Browse available assets'
    },
    {
      id: 3,
      type: 'success',
      message: 'Your headphone request has been approved',
      asset: 'Sony WH-1000XM5',
      date: '2023-07-10'
    }
  ];

  return (
    <Card title="Notifications" style={{ marginTop: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {alerts.map((alert: any) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            showIcon
            icon={alert.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            action={alert.action && <Button size="small">{alert.action}</Button>}
            style={{ width: '100%' }}
          />
        ))}
      </Space>
    </Card>
  );
};

// Main EmployeeAssets Component
const EmployeeAssets = () => {
  const { isDarkMode } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleViewDetails = (asset: any) => {
    setSelectedAsset(asset);
    setDetailsModalVisible(true);
  };

  const handleRequestAsset = (asset = null) => {
    setSelectedAsset(asset);
    setRequestModalVisible(true);
  };

  const handleReturnAsset = (asset: any) => {
    setSelectedAsset(asset);
    setReturnModalVisible(true);
  };

  const handleRequestSubmit = (requestData: any) => {
    // In a real app, this would make an API call
    console.log('Asset request submitted:', requestData);
    // Show success message
  };

  const handleReturnSubmit = (returnData: any) => {
    // In a real app, this would make an API call
    console.log('Asset return submitted:', returnData);
    // Show success message
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <AssetDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Divider />

      <AssetTable
        onViewDetails={handleViewDetails}
        onRequestAsset={handleRequestAsset}
        onReturnAsset={handleReturnAsset}
      />
      <Divider />


      <AssetAlerts />

      <AssetDetailsModal
        asset={selectedAsset}
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
      />

      <RequestAssetModal
        asset={selectedAsset}
        visible={requestModalVisible}
        onClose={() => setRequestModalVisible(false)}
        onRequest={handleRequestSubmit}
      />

      <ReturnAssetModal
        asset={selectedAsset}
        visible={returnModalVisible}
        onClose={() => setReturnModalVisible(false)}
        onReturn={handleReturnSubmit}
      />
    </Wrapper>
  );
};

export default EmployeeAssets;