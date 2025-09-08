// AdminDashboard/components/Announcements.tsx
import React from "react";
import { SectionCard } from "./styles";
import { Space, Typography } from "antd";
import type { Announcement } from "../types";

const { Text } = Typography;

interface Props {
  announcements: Announcement[];
}

const Announcements: React.FC<Props> = ({ announcements }) => {
  return (
    <SectionCard title="Announcements">
      <Space direction="vertical" style={{ width: "100%" }}>
        {announcements.map((a) => (
          <div key={a.id}>
            <Text strong>{a.title}</Text>
            <div style={{ color: "#666", marginTop: 6 }}>{a.body}</div>
            <div style={{ marginTop: 6 }}>
              <small style={{ color: "#999" }}>{a.postedAt} • {a.author ?? "Admin"}</small>
            </div>
          </div>
        ))}
      </Space>
    </SectionCard>
  );
};

export default Announcements;
