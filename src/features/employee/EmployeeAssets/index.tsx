import React, { useState } from "react";
import { Button, Space, message } from "antd";
import AssetDashboard from "./components/AssetDashboard";
import AssetTable from "./components/AssetTable";
import AssetDetailsModal from "./components/AssetDetailsModal";
import RequestAssetModal from "./components/RequestAssetModal";
import ReturnAssetModal from "./components/ReturnAssetModal";
import AssetAlerts, { AssetAlert } from "./components/AssetAlerts";
import { PageWrapper } from "./components/styles";
import type { Asset } from "./types";

// -----------------------------------------------------------------------------
// Mock Data — replace with API data
// -----------------------------------------------------------------------------
const mockAssets: any = [
  {
    id: "1",
    name: "Dell Laptop XPS 13",
    category: "Laptop",
    status: "Assigned",
    assignedDate: "2025-08-01",
    returnDate: "2025-09-15",
    condition: "Good",
  },
  {
    id: "2",
    name: "Logitech MX Master 3",
    category: "Mouse",
    status: "Assigned",
    assignedDate: "2025-07-10",
    returnDate: "2025-08-31",
    condition: "Good",
  },
];

const mockAlerts: AssetAlert[] = [
  {
    id: "a1",
    assetId: "2",
    assetName: "Logitech MX Master 3",
    type: "Overdue",
    message: "This asset was due on 31 Aug 2025.",
    date: "2025-09-01",
  },
  {
    id: "a2",
    assetId: "1",
    assetName: "Dell Laptop XPS 13",
    type: "Due",
    message: "Laptop return is due soon (15 Sep 2025).",
    date: "2025-09-10",
  },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [alerts, setAlerts] = useState<AssetAlert[]>(mockAlerts);

  // Modal state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetails(true);
  };

  const handleRequestAsset = () => {
    setShowRequest(true);
  };

  const handleReturnAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowReturn(true);
  };

  const handleRequestSubmit = (data: any) => {
    console.log("Asset request submitted:", data);
    message.success("Your request has been submitted.");
  };

  const handleReturnSubmit = (data: any) => {
    console.log("Return submitted:", data);
    message.success("Your return request has been submitted.");
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    message.success("Alert acknowledged.");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <PageWrapper>
      {/* Dashboard summary */}
      <AssetDashboard
        assets={assets}
        onRequestAsset={handleRequestAsset}
      />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Alerts */}
        <AssetAlerts
          alerts={alerts}
          onAcknowledge={handleAcknowledgeAlert}
          onViewAsset={(assetId) => {
            const asset = assets.find((a) => a.id === assetId);
            if (asset) handleViewDetails(asset);
          }}
          onRequestReturn={(assetId) => {
            const asset = assets.find((a) => a.id === assetId);
            if (asset) handleReturnAsset(asset);
          }}
        />

        {/* Asset Table */}
        <AssetTable
          data={assets}
          onView={handleViewDetails}
          onReturn={handleReturnAsset}
        />

        {/* Quick Action */}
        <Button type="primary" onClick={handleRequestAsset}>
          Request New Asset
        </Button>
      </Space>

      {/* Modals */}
      <AssetDetailsModal
        visible={showDetails}
        asset={selectedAsset || undefined}
        onClose={() => setShowDetails(false)}
      />

      <RequestAssetModal
        visible={showRequest}
        onClose={() => setShowRequest(false)}
        onSubmit={handleRequestSubmit}
      />

      <ReturnAssetModal
        visible={showReturn}
        asset={selectedAsset || undefined}
        onClose={() => setShowReturn(false)}
        onSubmit={handleReturnSubmit}
      />
    </PageWrapper>
  );
};

export default Assets;
