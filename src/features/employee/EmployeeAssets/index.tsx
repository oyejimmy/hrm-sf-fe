import React, { useState } from "react";
import {
  Divider,
  Row,
  Col,
  Space,
  Spin,
  Button,
} from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import AssetTable from "./components/AssetTable";
import AssetModal from "./components/AssetModal";
import AvailableAssetsModal from "./components/AvailableAssetsModal";
import {
  Package,
  User,
  CheckCircle,
  AlertTriangle,
  List,
} from "lucide-react";
import { Asset, DashboardStatsProps } from "./types";
import { StateCard } from "../../../components/StateCard";
import { useAvailableAssets, useAssetStats, useCreateAssetRequest } from '../../../hooks/api/useAssets';
import { useCreateNotification } from '../../../hooks/api/useNotifications';
import { LoadingContainer } from "./components/styles";



const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalAssets,
  assignedAssets,
  availableAssets,
  pendingRequests,
}) => {
  const statsConfig = [
    {
      label: "Total Assets",
      value: totalAssets,
      icon: <Package />,
      tone: "pastelBlue" as const,
      color: "#1890ff"
    },
    {
      label: "Assigned to Me",
      value: assignedAssets,
      icon: <User />,
      tone: "pastelGreen" as const,
      color: "#52c41a"
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: <AlertTriangle />,
      tone: "lightPeach" as const,
      color: "#faad14"
    },
    {
      label: "Available Assets",
      value: availableAssets,
      icon: <CheckCircle />,
      tone: "softLavender" as const,
      color: "#722ed1"
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {statsConfig.map((stat, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <StateCard
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            tone={stat.tone}
            valueStyle={{ color: stat.color }}
          />
        </Col>
      ))}
    </Row>
  );
};



const EmployeeAssets: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  const { data: availableAssets = [] } = useAvailableAssets();
  const { data: stats, isLoading: statsLoading } = useAssetStats();
  const createAssetRequestMutation = useCreateAssetRequest();
  const createNotificationMutation = useCreateNotification();
  
  const handleViewAsset = (asset: Asset) => {
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

  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
    setSelectedAsset(null);
  };

  const handleCloseRequest = () => {
    setRequestModalVisible(false);
    setSelectedAsset(null);
  };

  const handleCloseReturn = () => {
    setReturnModalVisible(false);
    setSelectedAsset(null);
  };

  const handleRequest = async (requestData: any) => {
    try {
      const request = await createAssetRequestMutation.mutateAsync({
        asset_id: selectedAsset?.id,
        asset_type: requestData.assetType,
        reason: requestData.reason,
        status: 'pending'
      });
      
      // Send notification to admin
      await createNotificationMutation.mutateAsync({
        title: 'New Asset Request',
        message: `Employee has requested ${requestData.quantity} ${requestData.assetType}(s) - ${requestData.assetName || selectedAsset?.name}`,
        type: 'asset_request',
        priority: requestData.urgency?.toLowerCase() || 'medium',
        recipient_role: 'admin'
      });
      
      handleCloseRequest();
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  const handleReturn = (returnData: any) => {
    console.log('Return submitted:', returnData);
  };

  if (statsLoading) {
    return (
      <Wrapper>
        <LoadingContainer>
          <Spin size="large" tip="Loading dashboard..." />
        </LoadingContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderComponent
        title="My Assets"
        subtitle="Manage your assigned assets and requests"
        breadcrumbItems={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "My Assets" }
        ]}
        extraButtons={[
          <Button
            key="inventory"
            type="primary"
            icon={<List size={16} />}
            onClick={() => setInventoryModalVisible(true)}
          >
            View Inventory
          </Button>
        ]}
        isDarkMode={isDarkMode}
      />
      
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <DashboardStats
          totalAssets={stats?.total_assets || 0}
          assignedAssets={stats?.assigned_assets || 0}
          availableAssets={stats?.available_assets || 0}
          pendingRequests={stats?.pending_requests || 0}
        />
        
        <Divider />
        
        <AssetTable
          assetsData={availableAssets}
          onViewDetails={handleViewAsset}
          onRequestAsset={handleRequestAsset}
          onReturnAsset={handleReturnAsset}
        />
      </Space>
      
      <AssetModal
        asset={selectedAsset}
        detailsModalVisible={detailsModalVisible}
        requestModalVisible={requestModalVisible}
        returnModalVisible={returnModalVisible}
        onCloseDetails={handleCloseDetails}
        onCloseRequest={handleCloseRequest}
        onCloseReturn={handleCloseReturn}
        onRequest={handleRequest}
        onReturn={handleReturn}
      />
      
      <AvailableAssetsModal
        visible={inventoryModalVisible}
        onClose={() => setInventoryModalVisible(false)}
      />
      

    </Wrapper>
  );
};

export default EmployeeAssets;