import React from 'react';
import { Modal } from 'antd';

interface ConfirmModalProps {
  title: string;
  content: string;
  onConfirm: () => void;
  okText?: string;
  okType?: 'danger' | 'primary';
  cancelText?: string;
}

export const showConfirmModal = ({
  title,
  content,
  onConfirm,
  okText = 'OK',
  okType = 'primary',
  cancelText = 'Cancel'
}: ConfirmModalProps) => {
  Modal.confirm({
    title,
    content,
    okText,
    okType,
    cancelText,
    onOk: onConfirm,
  });
};