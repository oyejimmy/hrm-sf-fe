import React from 'react';
import { Modal, Upload, Button, Typography, Divider } from 'antd';
import { CloudUpload, Upload as UploadIcon } from 'lucide-react';

const { Text } = Typography;

interface BulkUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpload: (info: any) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  visible,
  onCancel,
  onUpload
}) => {
  return (
    <Modal
      title="Bulk Document Upload"
      visible={visible}
      width={500}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="upload" type="primary" icon={<UploadIcon size={16} />}>
          Start Upload
        </Button>
      ]}
    >
      <Text>
        Upload multiple documents at once. The system will automatically match files to employees based on file names.
      </Text>
      
      <Upload.Dragger 
        multiple
        onChange={onUpload}
        beforeUpload={() => false}
        style={{ marginTop: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <CloudUpload size={48} />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Support for multiple files. Maximum file size: 10MB per file
        </p>
      </Upload.Dragger>
      
      <Divider />
      
      <Text strong>File Naming Convention:</Text>
      <ul>
        <li>employeeId_documentType.pdf (e.g., 123_resume.pdf)</li>
        <li>employeeName_documentType.pdf (e.g., john_doe_contract.pdf)</li>
      </ul>
    </Modal>
  );
};

export default BulkUploadModal;