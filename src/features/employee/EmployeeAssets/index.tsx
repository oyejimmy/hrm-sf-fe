import React, { useState } from 'react';
import { Layout, Divider, Row, Col, Card, Statistic, Space, Typography, Alert, Button } from 'antd';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import AssetTable from './components/AssetTable';
import AssetModal from './components/AssetModal';
import {
  Package,
  User,
  CheckCircle,
  AlertTriangle,
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Printer
} from 'lucide-react';
import { Asset, Request, DashboardStatsProps } from './types';

const { Title, Text } = Typography;

// Mock data (will be replaced with API calls later)
const mockAssetsData: Asset[] = [
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

const mockRequests: Request[] = [
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

// Dashboard Statistics Component
const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalAssets,
  assignedAssets,
  availableAssets,
  pendingRequests
}) => {

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Assets"
            value={totalAssets}
            prefix={<Package size={20} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Assigned to Me"
            value={assignedAssets}
            prefix={<User size={20} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Available Assets"
            value={availableAssets}
            prefix={<CheckCircle size={20} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Pending Requests"
            value={pendingRequests}
            prefix={<AlertTriangle size={20} />}
          />
        </Card>
      </Col>
    </Row>
  );
};

// Asset Distribution Chart Component
const AssetDistributionChart: React.FC = () => {
  return (
    <Card title="Asset Distribution by Type" style={{ height: 300 }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Laptop size={40} style={{ margin: 10 }} color="#1890ff" />
        <Monitor size={40} style={{ margin: 10 }} color="#52c41a" />
        <Smartphone size={40} style={{ margin: 10 }} color="#faad14" />
        <Headphones size={40} style={{ margin: 10 }} color="#722ed1" />
        <Printer size={40} style={{ margin: 10 }} color="#f5222d" />
        <Text>Asset type distribution chart would appear here</Text>
      </div>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  return (
    <Card title="Recent Activity" style={{ height: 300, overflow: 'auto' }}>
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
        <div>
          <Text strong>New laptop inventory added</Text>
          <br />
          <Text type="secondary">2 weeks ago</Text>
        </div>
      </Space>
    </Card>
  );
};

// Asset Alerts Component
const AssetAlerts: React.FC = () => {
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
    <Card title="Notifications" style={{ height: 300, overflow: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type as "success" | "info" | "warning" | "error"}
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
const EmployeeAssets: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
  const [requestModalVisible, setRequestModalVisible] = useState<boolean>(false);
  const [returnModalVisible, setReturnModalVisible] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Calculate statistics
  const totalAssets = mockAssetsData.length;
  const assignedAssets = mockAssetsData.filter(asset => asset.status === 'Assigned').length;
  const availableAssets = mockAssetsData.filter(asset => asset.status === 'Available').length;
  const pendingRequests = mockRequests.filter(request => request.status === 'Pending').length;

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsModalVisible(true);
  };

  const handleRequestAsset = (asset: Asset | null = null) => {
    setSelectedAsset(asset);
    setRequestModalVisible(true);
  };

  const handleReturnAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setReturnModalVisible(true);
  };

  const handleRequestSubmit = (requestData: any) => {
    console.log('Asset request submitted:', requestData);
  };

  const handleReturnSubmit = (returnData: any) => {
    console.log('Asset return submitted:', returnData);
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Asset Management"
        subtitle="Manage your Assets"
        breadcrumbItems={[{ title: 'Home', href: '/' }]}
      />

      <DashboardStats
        totalAssets={totalAssets}
        assignedAssets={assignedAssets}
        availableAssets={availableAssets}
        pendingRequests={pendingRequests}
      />

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <AssetDistributionChart />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <RecentActivity />
        </Col>
        <Col xs={24} lg={8}>
          <AssetAlerts />
        </Col>
      </Row>

      <Divider />

      <AssetTable
        assetsData={mockAssetsData}
        onViewDetails={handleViewDetails}
        onRequestAsset={handleRequestAsset}
        onReturnAsset={handleReturnAsset}
      />

      <AssetModal
        asset={selectedAsset}
        detailsModalVisible={detailsModalVisible}
        requestModalVisible={requestModalVisible}
        returnModalVisible={returnModalVisible}
        onCloseDetails={() => setDetailsModalVisible(false)}
        onCloseRequest={() => setRequestModalVisible(false)}
        onCloseReturn={() => setReturnModalVisible(false)}
        onRequest={handleRequestSubmit}
        onReturn={handleReturnSubmit}
      />
    </Wrapper>
  );
};

export default EmployeeAssets;