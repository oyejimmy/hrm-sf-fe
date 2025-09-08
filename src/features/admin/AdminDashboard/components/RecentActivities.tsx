// AdminDashboard/components/RecentActivities.tsx
import React from "react";
import { Table, Tag } from "antd";
import { SectionCard } from "./styles";
import type { Activity } from "../types";

interface Props {
  activities: Activity[];
}

/** RecentActivities: table feed with colored status tags */
const RecentActivities: React.FC<Props> = ({ activities }) => {
  const columns = [
    { title: "Activity", dataIndex: "activity", key: "activity" },
    { title: "Time", dataIndex: "time", key: "time", width: 140 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: Activity["status"]) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Completed"
            ? "green"
            : status === "Present"
            ? "blue"
            : status === "Submitted"
            ? "purple"
            : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <SectionCard title="Recent Activities">
      <Table dataSource={activities} columns={columns} pagination={false} size="small" rowKey="id" />
    </SectionCard>
  );
};

export default RecentActivities;
