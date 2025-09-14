import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Attendance } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

interface TodayAttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Attendance) => void;
  record?: Attendance | null;
}

const TodayAttendanceModal: React.FC<TodayAttendanceModalProps> = ({
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
      title={record ? 'Edit Attendance' : 'Add Attendance'}
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
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="Present">Present</Option>
            <Option value="Absent">Absent</Option>
            <Option value="Late">Late</Option>
            <Option value="Half Day">Half Day</Option>
          </Select>
        </Form.Item>
        <Form.Item name="hoursWorked" label="Hours Worked">
          <InputNumber min={0} max={24} style={{ width: '100%' }} placeholder="Enter hours worked" />
        </Form.Item>
        <Form.Item name="remarks" label="Remarks">
          <TextArea rows={3} placeholder="Enter any remarks" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodayAttendanceModal;