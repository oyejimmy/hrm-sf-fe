import React from "react";
import { Modal, Descriptions, Image } from "antd";
import { Asset } from "../types";

interface Props {
  visible: boolean;
  asset?: Asset;
  onClose: () => void;
}

const AssetDetailsModal: React.FC<Props> = ({ visible, asset, onClose }) => {
  return (
    <Modal open={visible} title="Asset Details" footer={null} onCancel={onClose}>
      {asset && (
        <>
          {asset.image && <Image src={asset.image} alt={asset.name} width={200} />}
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{asset.name}</Descriptions.Item>
            <Descriptions.Item label="Category">{asset.category}</Descriptions.Item>
            <Descriptions.Item label="Serial Number">{asset.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="Status">{asset.status}</Descriptions.Item>
            <Descriptions.Item label="Condition">{asset.condition}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default AssetDetailsModal;
