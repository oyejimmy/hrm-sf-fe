import React from "react";
import { Modal, Descriptions, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Document } from "../types";

const PreviewWrapper = styled.div`
  iframe, img {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
`;

interface Props {
  visible: boolean;
  doc: Document | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<Props> = ({ visible, doc, onClose }) => {
  if (!doc) return null;

  const isImage = doc.fileUrl.endsWith(".jpg") || doc.fileUrl.endsWith(".png");
  const isPdf = doc.fileUrl.endsWith(".pdf");

  return (
    <Modal title="Document Preview" visible={visible} onCancel={onClose} footer={null} width={800}>
      <PreviewWrapper>
        {isImage && <img src={doc.fileUrl} alt={doc.name} />}
        {isPdf && <iframe src={doc.fileUrl} title={doc.name} />}
        {!isImage && !isPdf && <p>Preview not available for this file type.</p>}
      </PreviewWrapper>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">{doc.name}</Descriptions.Item>
        <Descriptions.Item label="Type">{doc.type}</Descriptions.Item>
        <Descriptions.Item label="Uploaded On">{doc.uploadDate}</Descriptions.Item>
        <Descriptions.Item label="Description">{doc.description || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Status">{doc.status}</Descriptions.Item>
      </Descriptions>

      <Button type="primary" icon={<DownloadOutlined />} style={{ marginTop: 16 }} href={doc.fileUrl} download>
        Download
      </Button>
    </Modal>
  );
};

export default DocumentPreviewModal;
