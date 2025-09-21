import React from "react";
import { Typography } from "antd";
import { FileText, Eye, Download } from "lucide-react";
import {
//   StyledDocumentCard as StyleDocument,
  SecondaryButton,
  PrimaryButton,
} from "./styles";

const { Title, Text } = Typography;

interface DocumentCardProps {
  document: any;
  isDarkMode: boolean;
  onView?: (document: any) => void;
  onDownload?: (document: any) => void;
}

const DocumentCard = ({
  document,
  isDarkMode,
  onView,
  onDownload,
}: DocumentCardProps) => {
  const handleView = () => {
    if (onView) onView(document);
  };

  const handleDownload = () => {
    if (onDownload) onDownload(document);
  };

  return (
    <div data-dark-mode={isDarkMode}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: isDarkMode ? "#2a2a2a" : "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={24} color="#1890ff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={5}
              style={{
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {document.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {document.type} • {document.size} • {document.uploadDate}
            </Text>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <SecondaryButton
            isDarkMode={isDarkMode}
            icon={<Eye size={16} />}
            onClick={handleView}
          >
            View
          </SecondaryButton>
          <PrimaryButton icon={<Download size={16} />} onClick={handleDownload}>
            Download
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
