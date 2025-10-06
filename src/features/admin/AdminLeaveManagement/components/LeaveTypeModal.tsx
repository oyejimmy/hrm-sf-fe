import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Space
} from 'antd';
import { useTheme } from '../../../../contexts/ThemeContext';

interface LeaveTypeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  editData?: any;
}

const LeaveTypeModal: React.FC<LeaveTypeModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  editData
}) => {
  const { isDarkMode } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editData ? "Edit Leave Type" : "Add Leave Type"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          {editData ? 'Update' : 'Create'}
        </Button>
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Leave Type Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter leave type name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input placeholder="e.g., Sick Leave, Vacation" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Optional description of this leave type"
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Default Allocation (Days per year)"
          name="default_allocation"
          rules={[
            { required: true, message: 'Please enter default allocation' },
            { type: 'number', min: 0, message: 'Must be a positive number' }
          ]}
        >
          <InputNumber 
            min={0} 
            max={365}
            style={{ width: '100%' }}
            placeholder="e.g., 20"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaveTypeModal;