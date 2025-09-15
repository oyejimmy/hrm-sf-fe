import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface EditNotificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: { title?: string; content?: string }) => void;
  notification: Notification | null;
}

const EditNotificationModal: React.FC<EditNotificationModalProps> = ({ visible, onCancel, onEdit, notification }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (notification) {
      form.setFieldsValue(notification);
    }
  }, [notification, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onEdit(values);
    });
  };

  return (
    <Modal
      title="Edit Notification"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="edit_notification_form">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of the notification!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please input the content of the notification!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditNotificationModal;