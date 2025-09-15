import React from 'react';
import { Modal, Descriptions, Tag, Space, Avatar, Button, Divider, List, Typography } from 'antd';
import { Download, Edit, User, History } from 'lucide-react';
import { Document, Employee, DocumentType } from '../types';

const { Text } = Typography;

interface DocumentPreviewModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: () => void;
  document: Document | null;
  mockEmployees: Employee[];
  mockDocumentTypes: DocumentType[];
  getFileIcon: (fileName: string) => React.ReactNode;
  statusColors: Record<string, string>;
  statusIcons: Record<string, React.ReactNode>;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  onCancel,
  onEdit,
  document,
  mockEmployees,
  mockDocumentTypes,
  getFileIcon,
  statusColors,
  statusIcons
}) => {
  if (!document) return null;

  return (
    <Modal
      title="Document Details"
      visible={visible}
      width={700}
      onCancel={onCancel}
      footer={[
        <Button key="download" icon={<Download size={16} />}>
          Download
        </Button>,
        <Button 
          key="edit" 
          type="primary" 
          icon={<Edit size={16} />}
          onClick={onEdit}
        >
          Edit
        </Button>
      ]}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Employee" span={2}>
          <Space>
            <Avatar size="small" icon={<User size={16} />} />
            {document.employeeName}
            <Text type="secondary">
              ({mockEmployees.find(e => e.id === document.employeeId)?.department})
            </Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Document Type">
          <Space>
            {mockDocumentTypes.find(t => t.name === document.documentType)?.icon}
            {document.documentType}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          <Tag color="blue">{document.category}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="File Name">
          <Space>
            {getFileIcon(document.fileName)}
            {document.fileName}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="File Size">
          {document.fileSize}
        </Descriptions.Item>
        <Descriptions.Item label="Upload Date">
          {new Date(document.uploadDate).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag icon={statusIcons[document.status]} color={statusColors[document.status]}>
            {document.status}
          </Tag>
        </Descriptions.Item>
        {document.description && (
          <Descriptions.Item label="Description" span={2}>
            {document.description}
          </Descriptions.Item>
        )}
      </Descriptions>
      
      <Divider>Version History</Divider>
      <List
        size="small"
        dataSource={document.versions}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size="small" icon={<History size={16} />} />}
              title={`Version ${item.version} - ${item.uploadedBy}`}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{item.uploadDate}</Text>
                  <Text>{item.changes}</Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default DocumentPreviewModal;