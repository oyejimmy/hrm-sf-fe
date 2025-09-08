import React from "react";
import { Collapse, Checkbox, List } from "antd";
import { RoadmapTrack } from "../types";
import { ModuleCard } from "./styles";

interface RoadmapViewerProps {
  track: RoadmapTrack;
  onToggleModule: (moduleId: string) => void;
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ track, onToggleModule }) => {
  return (
    <Collapse defaultActiveKey={["1"]}>
      {track.milestones.map((module) => (
        <Collapse.Panel header={module.topic} key={module.id}>
          <ModuleCard>
            <p>{module.description}</p>
            <p><strong>Estimated Time:</strong> {module.estimatedTime}</p>
            <List
              size="small"
              header={<strong>Resources</strong>}
              dataSource={module.resources}
              renderItem={(res) => <List.Item><a href={res} target="_blank">{res}</a></List.Item>}
            />
            <Checkbox
              checked={module.completed}
              onChange={() => onToggleModule(module.id)}
            >
              Mark as Completed
            </Checkbox>
          </ModuleCard>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default RoadmapViewer;
