// AdminDashboard/components/PerformanceSnapshot.tsx
import React from "react";
import { List, Badge } from "antd";
import { SectionCard } from "./styles";
import type { PerformanceSnapshotItem } from "../types";

interface Props {
  items: PerformanceSnapshotItem[];
}

const PerformanceSnapshot: React.FC<Props> = ({ items }) => {
  return (
    <SectionCard title="Performance Snapshot">
      <List
        dataSource={items}
        renderItem={(it) => (
          <List.Item key={it.id}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{it.cycle}</div>
                <div style={{ color: "#666" }}>{it.completedCount} reviews completed</div>
              </div>
              <Badge count={`${it.avgScore}%`} style={{ backgroundColor: "#52c41a" }} />
            </div>
          </List.Item>
        )}
      />
    </SectionCard>
  );
};

export default PerformanceSnapshot;
