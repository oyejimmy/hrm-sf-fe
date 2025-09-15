import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteNotificationConfirmationProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  notificationTitle: string;
}

const DeleteNotificationConfirmation: React.FC<DeleteNotificationConfirmationProps> = ({
  visible,
  onCancel,
  onConfirm,
  notificationTitle,
}) => {
  return (
    <Modal
      title="Confirm Deletion"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" danger onClick={onConfirm}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete the notification: <strong>{notificationTitle}</strong>?</p>
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

export default DeleteNotificationConfirmation;