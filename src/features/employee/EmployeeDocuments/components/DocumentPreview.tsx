import React from 'react';
import { Modal, Button, Typography, Row, Col, Tag, Divider } from 'antd';
import { Download, Printer, FileText, Eye } from 'lucide-react';
import { Document } from '../mockData';
import { PreviewContainer } from '../styles';

const { Title, Text } = Typography;

interface DocumentPreviewProps {
  document: Document | null;
  visible: boolean;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, visible, onClose }) => {
  if (!document) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Eye size={20} />
          {document.name}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" icon={<Download size={16} />}>
          Download
        </Button>,
        <Button key="print" icon={<Printer size={16} />}>
          Print
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width="90%"
      style={{ maxWidth: 800 }}
    >
      <Row gutter={[16, 8]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Text strong>Type:</Text> {document.type.toUpperCase()}
          <br />
          <Text strong>Category:</Text> {document.category}
          <br />
          <Text strong>Size:</Text> {document.size}
        </Col>
        <Col xs={24} sm={12}>
          <Text strong>Upload Date:</Text> {new Date(document.uploadDate).toLocaleDateString()}
          <br />
          <Text strong>Status:</Text>{' '}
          <Tag color={document.status === 'Approved' ? 'green' : 'orange'}>
            {document.status}
          </Tag>
          <br />
          <Text strong>Shared with:</Text> {document.sharedWith.join(', ')}
        </Col>
      </Row>

      <Divider />

      <PreviewContainer>
        <FileText size={64} />
        <p>Document preview would appear here</p>
      </PreviewContainer>
    </Modal>
  );
};