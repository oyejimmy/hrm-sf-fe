import React from 'react';
import { Modal, Descriptions, Tag, Space } from 'antd';

interface ComplaintDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  complaint: {
    id: string;
    subject: string;
    type: string;
    status: string;
    date: string;
    priority: string;
    description: string;
    attachments?: string[];
  } | null;
}

const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  visible,
  onClose,
  complaint,
}) => {
  if (!complaint) {
    return null;
  }

  return (
    <Modal
      title="Complaint Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Subject">{complaint.subject}</Descriptions.Item>
        <Descriptions.Item label="Type">{complaint.type}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={complaint.status === 'Pending' ? 'volcano' : 'green'}>
            {complaint.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date">{complaint.date}</Descriptions.Item>
        <Descriptions.Item label="Priority">
          <Tag
            color={
              complaint.priority === 'high'
                ? 'red'
                : complaint.priority === 'medium'
                ? 'orange'
                : 'blue'
            }
          >
            {complaint.priority.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {complaint.description}
        </Descriptions.Item>
        {complaint.attachments && complaint.attachments.length > 0 && (
          <Descriptions.Item label="Attachments">
            <Space>
              {complaint.attachments.map((attachment, index) => (
                <a key={index} href={attachment} target="_blank" rel="noopener noreferrer">
                  Attachment {index + 1}
                </a>
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default ComplaintDetailsModal;