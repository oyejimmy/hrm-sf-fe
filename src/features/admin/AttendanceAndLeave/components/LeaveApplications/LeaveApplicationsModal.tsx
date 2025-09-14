import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { LeaveRequest } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

interface LeaveApplicationsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: LeaveRequest) => void;
  record?: LeaveRequest | null;
}

const LeaveApplicationsModal: React.FC<LeaveApplicationsModalProps> = ({
  visible,
  onClose,
  onSave,
  record
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form, visible]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave({ ...values, id: record?.id || Date.now() });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={record ? 'Edit Leave Request' : 'Add Leave Request'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={record ? 'Update' : 'Add'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="employeeName"
          label="Employee Name"
          rules={[{ required: true, message: 'Please enter employee name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter employee name" />
        </Form.Item>
        <Form.Item
          name="leaveType"
          label="Leave Type"
          rules={[{ required: true, message: 'Please select leave type' }]}
        >
          <Select placeholder="Select leave type">
            <Option value="Sick Leave">Sick Leave</Option>
            <Option value="Vacation">Vacation</Option>
            <Option value="Personal Leave">Personal Leave</Option>
            <Option value="Maternity Leave">Maternity Leave</Option>
            <Option value="Paternity Leave">Paternity Leave</Option>
            <Option value="Emergency Leave">Emergency Leave</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select end date' }]}
        >
          <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: 'Please enter reason' }]}
        >
          <TextArea rows={3} placeholder="Enter reason for leave" />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select placeholder="Select status" defaultValue="Pending">
            <Option value="Pending">Pending</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaveApplicationsModal;