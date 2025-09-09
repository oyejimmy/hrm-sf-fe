import React from "react";
import { List } from "antd";
import { SectionCard } from "./styles";
import type { Activity } from "../types";

interface Props {
  activities: Activity[];
}

const RecentActivities: React.FC<Props> = ({ activities }) => (
  <SectionCard title="Recent Activities">
    <List
      dataSource={activities}
      renderItem={(item: any) => (
        <List.Item style={{ padding: '8px 0', border: 'none' }}>
          <List.Item.Meta
            description={
              <div>
                <div>{item.action}</div>
                <span style={{ fontSize: '12px', color: '#999' }}>{item.time}</span>
              </div>
            }
          />
        </List.Item>
      )}
    />
  </SectionCard>
);

export default RecentActivities;