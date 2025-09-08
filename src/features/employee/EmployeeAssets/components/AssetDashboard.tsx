import React from "react";
import { Card, Statistic, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DashboardGrid } from "./styles";
import type { Asset } from "../types";

interface AssetDashboardProps {
  assets: Asset[];
  onRequestAsset: () => void;
}

const AssetDashboard: React.FC<AssetDashboardProps> = ({ assets, onRequestAsset }) => {
  return (
    <DashboardGrid>
      <Card>
        <Statistic title="Total Assets Assigned" value={assets.length} />
      </Card>
      <Card>
        <Statistic title="Overdue Returns" value={1} valueStyle={{ color: "red" }} />
      </Card>
      <Card>
        <Statistic title="Upcoming Return Deadlines" value={2} />
      </Card>
      <Card>
        <Button type="primary" icon={<PlusOutlined />} onClick={onRequestAsset}>
          Request New Asset
        </Button>
      </Card>
    </DashboardGrid>
  );
};

export default AssetDashboard;
