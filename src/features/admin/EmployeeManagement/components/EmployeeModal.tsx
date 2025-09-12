import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
} from 'antd';
import { Employee, EmployeeFormData } from '../types/types';
import dayjs from 'dayjs';

interface EmployeeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: EmployeeFormData) => void;
  employee?: Employee;
  isEditing: boolean;
}

const { Option } = Select;

 const EmployeeModal = ({
  visible,
  onCancel,
  onSave,
  employee,
  isEditing,
}: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (employee) {
        form.setFieldsValue({
          ...employee,
          joinDate: employee.joinDate ? dayjs(employee.joinDate) : null,
          leaveDate: employee.leaveDate ? dayjs(employee.leaveDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, employee, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...values,
        joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : '',
        leaveDate: values.leaveDate ? values.leaveDate.format('YYYY-MM-DD') : undefined,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
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
          {isEditing ? 'Update Employee' : 'Add Employee'}
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="employeeForm"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter the full name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter the email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please select a position' }]}
        >
          <Select placeholder="Select position">
            <Option value="Software Engineer">Software Engineer</Option>
            <Option value="Product Manager">Product Manager</Option>
            <Option value="UX Designer">UX Designer</Option>
            <Option value="QA Engineer">QA Engineer</Option>
            <Option value="DevOps Engineer">DevOps Engineer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select placeholder="Select department">
            <Option value="Engineering">Engineering</Option>
            <Option value="Product">Product</Option>
            <Option value="Design">Design</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Sales">Sales</Option>
            <Option value="HR">Human Resources</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="on_leave">On Leave</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="joinDate"
          label="Join Date"
          rules={[{ required: true, message: 'Please select a join date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="leaveDate"
          label="Date of Leave"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;