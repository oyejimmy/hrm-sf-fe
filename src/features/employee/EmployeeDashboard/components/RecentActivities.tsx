import React from "react";
import { Timeline, Tag } from "antd";
import { SectionCard } from "./styles";
import type { Activity } from "../types";

interface Props {
  activities: Activity[];
}

const RecentActivities: React.FC<Props> = ({ activities }) => (
  <SectionCard title="Recent Activities">
    <Timeline>
      {activities.map((a) => (
        <Timeline.Item key={a.id}>
          {a.action} — {a.date}{" "}
          <Tag color={a.status === "Completed" ? "green" : a.status === "Pending" ? "orange" : "blue"}>
            {a.status}
          </Tag>
        </Timeline.Item>
      ))}
    </Timeline>
  </SectionCard>
);

export default RecentActivities;
