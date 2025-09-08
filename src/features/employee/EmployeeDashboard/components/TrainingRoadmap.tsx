import React from "react";
import { List, Progress } from "antd";
import { SectionCard } from "./styles";
import type { TrainingModule } from "../types";

interface Props {
  trainings: TrainingModule[];
}

const TrainingRoadmap: React.FC<Props> = ({ trainings }) => (
  <SectionCard title="Training Roadmap">
    <List
      dataSource={trainings}
      renderItem={(t) => (
        <List.Item key={t.id}>
          <div style={{ width: "100%" }}>
            <strong>{t.name}</strong>
            <Progress percent={t.progress} size="small" />
          </div>
        </List.Item>
      )}
    />
  </SectionCard>
);

export default TrainingRoadmap;
