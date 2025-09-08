import React from "react";
import { Modal, List, Button } from "antd";
import { RoadmapTrack } from "../types";

interface RoadmapModalProps {
  visible: boolean;
  onClose: () => void;
  tracks: RoadmapTrack[];
  onSelect: (track: RoadmapTrack) => void;
}

const RoadmapModal: React.FC<RoadmapModalProps> = ({ visible, onClose, tracks, onSelect }) => {
  return (
    <Modal
      open={visible}
      title="Select a Training Roadmap"
      footer={null}
      onCancel={onClose}
    >
      <List
        itemLayout="horizontal"
        dataSource={tracks}
        renderItem={(track) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => onSelect(track)}>Assign</Button>
            ]}
          >
            <List.Item.Meta
              title={track.title}
              description={track.description}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default RoadmapModal;
