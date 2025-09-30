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
  Space,
} from 'antd';
import { RefreshCw } from 'lucide-react';
import { useCreateEmployee, useUpdateEmployee, useDepartments, useManagers, Employee } from '../../../../hooks/api/useEmployees';
import dayjs from 'dayjs';

interface EmployeeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
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
}: EmployeeModalProps) => {
  const [form] = Form.useForm();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: departments = [] } = useDepartments();
  const { data: managers = [] } = useManagers();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('temp_password', password);
  };

  useEffect(() => {
    if (visible) {
      if (employee) {
        const [firstName, ...lastNameParts] = employee.name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        form.setFieldsValue({
          employee_id: employee.employee_id,
          first_name: firstName,
          last_name: lastName,
          email: employee.email,
          temp_password: employee.temp_password || '',
          phone: employee.phone,
          position: employee.position,
          department_id: employee.department_id,
          manager_id: employee.manager_id,
          employment_status: employee.employment_status,
          hire_date: employee.hire_date ? dayjs(employee.hire_date) : null,
          salary: employee.salary,
          work_location: employee.work_location,
          work_schedule: employee.work_schedule,
          work_type: employee.work_type,
          role: employee.role,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, employee, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const requestData = {
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          temp_password: values.temp_password,
          phone: values.phone || '',
          role: values.role,
        },
        employee: {
          employee_id: values.employee_id,
          position: values.position || '',
          department_id: values.department_id || null,
          manager_id: values.manager_id || null,
          employment_status: values.employment_status,
          hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : null,
          salary: values.salary || null,
          work_location: values.work_location,
          work_schedule: values.work_schedule,
          work_type: values.work_type,
        },
      };
      
      if (isEditing && employee) {
        await updateEmployee.mutateAsync({ id: employee.id, data: requestData });
      } else {
        await createEmployee.mutateAsync(requestData);
      }
      
      onSave();
    } catch (error: any) {
      if (error.errorFields) {
        // Form validation error - don't log, Ant Design will show the errors
        return;
      }
      console.error('Submission failed:', error);
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
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={createEmployee.isPending || updateEmployee.isPending}
        >
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
          <Col span={8}>
            <Form.Item
              name="employee_id"
              label="Employee ID"
              rules={[{ required: true, message: 'Please enter employee ID' }]}
            >
              <Input placeholder="Enter employee ID" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Company Email"
              rules={[
                { required: true, message: 'Please enter the company email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter company email address" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="temp_password"
              label={
                <Space>
                  Temp Password
                  <Button 
                    type="link" 
                    size="small"
                    onClick={generatePassword}
                    style={{ padding: 0, height: 'auto', fontSize: '12px' }}
                  >
                    Generate
                  </Button>
                </Space>
              }
              rules={[{ required: true, message: 'Please enter temporary password' }]}
            >
              <Input placeholder="Enter temporary password" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="position"
              label="Position"
            >
              <Input placeholder="Enter position" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="department_id"
              label="Department"
            >
              <Select placeholder="Select department">
                {departments.map((dept: any) => (
                  <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select placeholder="Select a role">
                <Option value="team_lead">Team Lead</Option>
                <Option value="hr">HR</Option>
                <Option value="admin">Admin</Option>
                <Option value="employee">Employee</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="manager_id"
              label="Manager"
            >
              <Select placeholder="Select manager">
                {managers.map((mgr: any) => (
                  <Option key={mgr.id} value={mgr.id}>{mgr.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="salary"
              label="Salary"
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
          <Col span={8}>
            <Form.Item
              name="hire_date"
              label="Hire Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="work_location"
              label="Work Location"
              rules={[{ required: true, message: 'Please select work location' }]}
            >
              <Select placeholder="Select work location">
                <Option value="office">Office</Option>
                <Option value="remote">Remote</Option>
                <Option value="hybrid">Hybrid</Option>
                <Option value="field">Field</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="employment_status"
              label="Employment Status"
              rules={[{ required: true, message: 'Please select employment status' }]}
            >
              <Select placeholder="Select employment status">
                <Option value="full_time">Full Time</Option>
                <Option value="part_time">Part Time</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="work_type"
              label="Work Type"
            >
              <Select placeholder="Select work type">
                <Option value="office">Office</Option>
                <Option value="remote">Remote</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="work_schedule"
              label="Work Schedule"
            >
              <Select placeholder="Select work schedule">
                <Option value="Standard (9:00 AM - 6:00 PM)">Standard (9:00 AM - 6:00 PM)</Option>
                <Option value="Flexible">Flexible</Option>
                <Option value="Shift Work">Shift Work</Option>
                <Option value="Morning Shift (6:00 AM - 2:00 PM)">Morning Shift (6:00 AM - 2:00 PM)</Option>
                <Option value="Evening Shift (2:00 PM - 10:00 PM)">Evening Shift (2:00 PM - 10:00 PM)</Option>
                <Option value="Night Shift (10:00 PM - 6:00 AM)">Night Shift (10:00 PM - 6:00 AM)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;