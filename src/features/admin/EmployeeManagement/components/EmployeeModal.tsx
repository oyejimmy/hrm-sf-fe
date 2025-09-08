import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

interface EmployeeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (employee: Partial<any>) => void;
  employee?: any | null;
  isEditing: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  onCancel,
  onSave,
  employee,
  isEditing
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Edit Employee' : 'Add Employee'}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Update' : 'Add'} Employee
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={employee || {}}
      >
        <Form.Item
          name={['employee', 'name']}
          label="Full Name"
          rules={[{ required: true, message: 'Please enter employee name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please select position' }]}
        >
          <Select placeholder="Select position">
            <Option value="Frontend Developer">Frontend Developer</Option>
            <Option value="Backend Developer">Backend Developer</Option>
            <Option value="HR Manager">HR Manager</Option>
            <Option value="Project Manager">Project Manager</Option>
            <Option value="QA Engineer">QA Engineer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: 'Please select department' }]}
        >
          <Select placeholder="Select department">
            <Option value="Engineering">Engineering</Option>
            <Option value="Human Resources">Human Resources</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Operations">Operations</Option>
            <Option value="Quality Assurance">Quality Assurance</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="Active">Active</Option>
            <Option value="On Leave">On Leave</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="joinDate"
          label="Join Date"
          rules={[{ required: true, message: 'Please select join date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dateOfLeave"
          label="Date of Leave"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;