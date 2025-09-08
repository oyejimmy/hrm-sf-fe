// AdminDashboard/components/TrainingSummary.tsx
import React from "react";
import { List, Progress } from "antd";
// import { SectionCard } from "../styles";
import type { TrainingSummaryItem } from "../types";
import { SectionCard } from "./styles";

interface Props {
  summaries: TrainingSummaryItem[];
}

/** shows training tracks with progress bars and counts */
const TrainingSummary: React.FC<Props> = ({ summaries }) => {
  return (
    <SectionCard title="Training & Roadmap Summary">
      <List
        dataSource={summaries}
        renderItem={(s) => (
          <List.Item key={s.id}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{s.track}</strong>
                <small>{s.completed}/{s.assigned} completed</small>
              </div>
              <Progress percent={Math.round(s.avgProgress)} size="small" />
            </div>
          </List.Item>
        )}
      />
    </SectionCard>
  );
};

export default TrainingSummary;
