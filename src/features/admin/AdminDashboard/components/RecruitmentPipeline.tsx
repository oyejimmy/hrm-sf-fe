// AdminDashboard/components/RecruitmentPipeline.tsx
import React from "react";
import { List, Tag } from "antd";
import type { RecruitmentPipelineItem } from "../types";
import { SectionCard } from "./styles";

interface Props {
  pipeline: RecruitmentPipelineItem[];
}

const RecruitmentPipeline: React.FC<Props> = ({ pipeline }) => {
  return (
    <SectionCard title="Recruitment Pipeline">
      <List
        dataSource={pipeline}
        renderItem={(p) => (
          <List.Item key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div>{p.stage}</div>
              <Tag color="blue">{p.count}</Tag>
            </div>
          </List.Item>
        )}
      />
    </SectionCard>
  );
};

export default RecruitmentPipeline;
