import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Button, Divider, Typography } from 'antd';
import { Upload as UploadIcon, FileText, Eye, Lock } from 'lucide-react';

const { Text } = Typography;

const { Option } = Select;
const { Dragger } = Upload;

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (files: any) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ visible, onClose, onUpload }) => {
  const [fileList, setFileList] = useState<any>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onUpload(fileList);
      setFileList([]);
      onClose();
    }, 2000);
  };

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={20} />
          Upload Documents
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          icon={<UploadIcon size={16} />}
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Start Upload'}
        </Button>
      ]}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <Dragger {...uploadProps} multiple>
        <p className="ant-upload-drag-icon">
          <UploadIcon size={48} />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Support for single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>

      <Divider />

      <Form layout="vertical">
        <Form.Item label={<><FileText size={14} style={{ marginRight: 4 }} />Category</>}>
          <Select placeholder="Select a category">
            <Option value="Personal">Personal</Option>
            <Option value="Employment">Employment</Option>
            <Option value="HR">HR</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Training">Training</Option>
          </Select>
        </Form.Item>

        <Form.Item label={<><Eye size={14} style={{ marginRight: 4 }} />Visibility</>}>
          <Select defaultValue="private" placeholder="Select visibility">
            <Option value="private"><Lock size={14} style={{ marginRight: 4 }} />Private (Only me)</Option>
            <Option value="hr">HR Department</Option>
            <Option value="manager">My Manager</Option>
            <Option value="team">My Team</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};