import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface AttendanceAndLeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'attendance' | 'leave';
  record?: any | null;
}

const AttendanceAndLeaveModal: React.FC<AttendanceAndLeaveModalProps> = ({
  visible,
  onClose,
  onSave,
  type,
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

  const renderAttendanceForm = () => (
    <>
      <Form.Item
        name="employeeName"
        label="Employee Name"
        rules={[{ required: true, message: 'Please enter employee name' }]}
      >
        <Input placeholder="Enter employee name" />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
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
      <Form.Item
        name="hoursWorked"
        label="Hours Worked"
      >
        <InputNumber min={0} max={24} style={{ width: '100%' }} placeholder="Enter hours worked" />
      </Form.Item>
      <Form.Item
        name="remarks"
        label="Remarks"
      >
        <TextArea rows={3} placeholder="Enter any remarks" />
      </Form.Item>
    </>
  );

  const renderLeaveForm = () => (
    <>
      <Form.Item
        name="employeeName"
        label="Employee Name"
        rules={[{ required: true, message: 'Please enter employee name' }]}
      >
        <Input placeholder="Enter employee name" />
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
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: 'Please select end date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="reason"
        label="Reason"
        rules={[{ required: true, message: 'Please enter reason' }]}
      >
        <TextArea rows={3} placeholder="Enter reason for leave" />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
      >
        <Select placeholder="Select status" defaultValue="Pending">
          <Option value="Pending">Pending</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
      </Form.Item>
    </>
  );

  return (
    <Modal
      title={record ? `Edit ${type === 'attendance' ? 'Attendance' : 'Leave Request'}` : `Add ${type === 'attendance' ? 'Attendance' : 'Leave Request'}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={record ? 'Update' : 'Add'}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
      >
        {type === 'attendance' ? renderAttendanceForm() : renderLeaveForm()}
      </Form>
    </Modal>
  );
};

export default AttendanceAndLeaveModal;