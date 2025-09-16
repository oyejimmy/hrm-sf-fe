import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  InputNumber,
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
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="employeeForm"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: 'Please enter employee ID' }]}
            >
              <Input placeholder="Enter employee ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter the full name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select placeholder="Select a role">
                <Option value="Team Lead">Team Lead</Option>
                <Option value="HR">HR</Option>
                <Option value="Admin">Admin</Option>
                <Option value="Employee">Employee</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="supervisor"
              label="Supervisor"
              rules={[{ required: true, message: 'Please enter supervisor name' }]}
            >
              <Input placeholder="Enter supervisor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: 'Please enter salary amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter salary"
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="workLocation"
              label="Work Location"
              rules={[{ required: true, message: 'Please enter work location' }]}
            >
              <Select placeholder="Select work location">
                <Option value="Head Office">Head Office</Option>
                <Option value="Branch Office">Branch Office</Option>
                <Option value="Remote">Remote</Option>
                <Option value="Hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="employmentType"
              label="Employment Type"
              rules={[{ required: true, message: 'Please select employment type' }]}
            >
              <Select placeholder="Select employment type">
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Internship">Internship</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="joinDate"
              label="Join Date"
              rules={[{ required: true, message: 'Please select a join date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leaveDate"
              label="Date of Leave"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;