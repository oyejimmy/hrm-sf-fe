import React from "react";
import { Row, Col } from "antd";
import { Package, User, CheckCircle, AlertTriangle } from "lucide-react";
import { StateCard } from "../../../../components/StateCard";
import { DashboardStatsProps } from "../types";

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

export default DashboardStats;