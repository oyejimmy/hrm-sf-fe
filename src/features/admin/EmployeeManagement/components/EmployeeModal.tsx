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
  AutoComplete,
  Tooltip,
  Typography,
  message,
  Radio,
} from 'antd';
import { RefreshCw, Mail, Copy, UserX } from 'lucide-react';
import { useCreateEmployee, useUpdateEmployee, useDepartments, usePositions, useManagers, useGenerateEmployeeId, Employee } from '../../../../hooks/api/useEmployees';
import { useFormOptions } from '../../../../hooks/api/useFormOptions';
import { COUNTRY_CODES } from '../../../../utils/constants';
import { useState } from 'react';
import api from '../../../../services/api/api';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '../../../../constants';

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
  const { data: positions = [] } = usePositions();
  const { data: managers = [] } = useManagers();
  const { data: formOptions } = useFormOptions();
  const generateEmployeeId = useGenerateEmployeeId();
  const [isEmployeeIdGenerated, setIsEmployeeIdGenerated] = React.useState(false);

  const [salaryInWords, setSalaryInWords] = useState('');
  const [managerOptions, setManagerOptions] = useState([]);

  const convertNumberToWords = (num: number): string => {
    if (num === 0) return 'Zero Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertHundreds = (n: number): string => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        n = 0;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };
    
    let result = '';
    if (num >= 10000000) {
      result += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
      num %= 10000000;
    }
    if (num >= 100000) {
      result += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    if (num >= 1000) {
      result += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    if (num > 0) {
      result += convertHundreds(num);
    }
    
    return result.trim() + ' Rupees Only';
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('temp_password', password);
  };

  const handleGenerateEmployeeId = async () => {
    try {
      const result = await generateEmployeeId.mutateAsync();
      form.setFieldValue('employee_id', result.employee_id);
      setIsEmployeeIdGenerated(true);
    } catch (error) {
      console.error('Failed to generate employee ID:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      if (employee) {
        console.log('Employee data:', employee);
        const [firstName, ...lastNameParts] = employee.name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        // Find position_id from position title if not available
        let positionId = employee.position_id;
        if (!positionId && employee.position && positions.length > 0) {
          const foundPosition = positions.find((pos: any) => pos.title === employee.position);
          positionId = foundPosition?.id;
        }
        
        const formData: any = {
          employee_id: employee.employee_id,
          title: employee.title || 'Mr',
          first_name: firstName,
          last_name: lastName,
          email: employee.email,
          email_username: employee.email ? employee.email.split('@')[0] : '',
          email_domain: employee.email ? '@' + employee.email.split('@')[1] : '@smartforum.org',
          temp_password: employee.temp_password || '',
          phone: employee.phone || '',
          country_code: employee.phone ? (COUNTRY_CODES.find(c => employee.phone?.startsWith(c.code))?.code || '+92') : '+92',
          phone_number: (() => {
            if (!employee.phone) return '';
            const countryCode = COUNTRY_CODES.find(c => employee.phone?.startsWith(c.code))?.code || '+92';
            return employee.phone.startsWith(countryCode) ? employee.phone.substring(countryCode.length) : employee.phone;
          })(),
          position: employee.position || '',
          position_id: positionId,
          department_id: employee.department_id,
          manager_id: employee.manager_id,
          manager_display: employee.manager || '',
          employment_type: employee.employment_type,
          employment_status: employee.employment_status,
          hire_date: employee.hire_date ? dayjs(employee.hire_date) : null,
          salary: employee.salary,
          salary_in_words: employee.salary_in_words || '',
          work_location: employee.work_location,
          work_schedule: employee.work_schedule || '',
          work_type: employee.work_type || '',
          role: employee.role,
          active: employee.active !== undefined ? employee.active : true,
        };
        
        // Set salary in words if exists or calculate if salary exists
        if (employee.salary_in_words) {
          setSalaryInWords(employee.salary_in_words);
        } else if (employee.salary) {
          const words = convertNumberToWords(employee.salary);
          formData.salary_in_words = words;
          setSalaryInWords(words);
        }
        
        console.log('Form data being set:', formData);
        form.setFieldsValue(formData);
      } else {
        form.resetFields();
        form.setFieldValue('role', 'employee');
        form.setFieldValue('email_domain', '@smartforum.org');
        form.setFieldValue('country_code', '+92');
        form.setFieldValue('active', true);
        setSalaryInWords('Auto-generated');
        setIsEmployeeIdGenerated(false);
      }
    }
  }, [visible, employee, form, positions]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const requestData = {
        user: {
          title: values.title || null,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          temp_password: values.temp_password,
          phone: values.phone || '',
          role: values.role,
          active: values.active,
        },
        employee: {
          employee_id: values.employee_id,
          position: values.position || '',
          position_id: values.position_id || null,
          department_id: values.department_id || null,
          manager_id: values.manager_id || null,
          employment_type: values.employment_type,
          employment_status: values.employment_status,
          hire_date: values.hire_date ? values.hire_date.format(DATE_FORMATS.INPUT) : null,
          salary: values.salary || null,
          salary_in_words: values.salary_in_words || null,
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
    setIsEmployeeIdGenerated(false);
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Edit Employee' : 'Add Employee'}
      open={visible}
      onCancel={handleCancel}
      centered
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
          {isEditing ? 'Save Update' : 'Save'}
        </Button>,
      ]}
      width={950}
    >
      <Form
        form={form}
        layout="vertical"
        name="employeeForm"
      >
        {/* First Row: Title, First Name, Last Name */}
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please select title' }]}
            >
              <Select placeholder="Select title" allowClear>
                {formOptions?.titles.map(title => (
                  <Option key={title.value} value={title.value}>{title.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter employee first name" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter employee last name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Second Row: Hire Date, Employee ID, Role */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="hire_date"
              label="Hire Date"
              rules={[{ required: true, message: 'Please select hire date' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Select employee hire date" showToday={false} format={DATE_FORMATS.DISPLAY} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="employee_id"
              label={
                <Space>
                  Employee ID
                  {!isEditing && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={handleGenerateEmployeeId}
                      disabled={isEmployeeIdGenerated}
                      loading={generateEmployeeId.isPending}
                      style={{ padding: 0, height: 'auto', fontSize: '12px' }}
                    >
                      Generate
                    </Button>
                  )}
                </Space>
              }
              rules={[{ required: true, message: 'Please enter employee ID' }]}
            >
              <Input 
                placeholder="Enter unique employee ID" 
                onChange={(e) => {
                  if (!e.target.value) {
                    setIsEmployeeIdGenerated(false);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select placeholder="Select employee role" allowClear>
                {formOptions?.roles.map(role => (
                  <Option key={role.value} value={role.value}>{role.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Third Row: Company Email, Temp Password */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label={
                <Space>
                  Company Email
                  <Tooltip title="Assign company email to this employee">
                    <span style={{ cursor: 'help' }}>ⓘ</span>
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: 'Please enter the company email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input.Group compact>
                <Form.Item
                  name="email_username"
                  noStyle
                >
                  <Input 
                    style={{ width: '50%' }} 
                    placeholder="Enter email username"
                    onChange={(e) => {
                      const username = e.target.value;
                      const domain = form.getFieldValue('email_domain') || '@smartforum.org';
                      form.setFieldValue('email', username + domain);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="email_domain"
                  noStyle
                  initialValue="@smartforum.org"
                >
                  <Select 
                    style={{ width: '50%' }}
                    allowClear
                    onChange={(domain) => {
                      const username = form.getFieldValue('email_username') || '';
                      form.setFieldValue('email', username + domain);
                    }}
                  >
                    {formOptions?.emailDomains.map(domain => (
                      <Option key={domain.value} value={domain.value}>{domain.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
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
              rules={!isEditing ? [{ required: true, message: 'Please enter temporary password' }] : []}
            >
              <Input placeholder="Enter employee temporary password" />
            </Form.Item>
          </Col>
        </Row>

        {/* Fourth Row: Salary, Salary in Figure */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: 'Please enter salary' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter employee salary"
                min={0}
                addonBefore="PKR"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/(,*)/g, '') as any}
                onChange={(value) => {
                  if (value) {
                    const words = convertNumberToWords(value);
                    form.setFieldValue('salary_in_words', words);
                    setSalaryInWords(words);
                  } else {
                    form.setFieldValue('salary_in_words', '');
                    setSalaryInWords('');
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <div>
              <label style={{ marginBottom: '8px', display: 'block' }}>
                Salary in Figure
              </label>
              <Typography.Text 
                style={{ 
                  display: 'block',
                  minHeight: '64px',
                  wordWrap: 'break-word'
                }}
              >
                {salaryInWords || 'Auto-generated'}
                {salaryInWords && (
                  <Copy 
                    size={14} 
                    style={{ cursor: 'pointer', marginLeft: '8px', color: '#1890ff' }} 
                    onClick={() => {
                      navigator.clipboard.writeText(salaryInWords);
                      message.success('Salary in Figure copied!');
                    }}
                  />
                )}
              </Typography.Text>
              <Form.Item name="salary_in_words" hidden>
                <Input />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* Fifth Row: Manager, Phone, Department */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="manager_id"
              label="Manager"
            >
              <Select
                placeholder="Select manager"
                allowClear
              >
                {managers.map((mgr: any) => (
                  <Select.Option key={mgr.id} value={mgr.id}>
                    {mgr.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="phone"
              label="Employee Contact"
            >
              <Input.Group compact>
                <Form.Item
                  name="country_code"
                  noStyle
                  initialValue="+92"
                >
                  <Select 
                    style={{ width: '30%' }} 
                    placeholder="Code"
                    allowClear
                    onChange={(newCountryCode) => {
                      const phoneNumber = form.getFieldValue('phone_number') || '';
                      let cleanNumber = phoneNumber;
                      
                      // Remove leading zero if present
                      if (cleanNumber.startsWith('0')) {
                        cleanNumber = cleanNumber.substring(1);
                      }
                      
                      form.setFieldValue('phone', `${newCountryCode}${cleanNumber}`);
                    }}
                  >
                    {COUNTRY_CODES.map(country => (
                      <Option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="phone_number"
                  noStyle
                >
                  <Input 
                    style={{ width: '70%' }} 
                    placeholder="Enter contact number"
                    onChange={(e) => {
                      const countryCode = form.getFieldValue('country_code') || '+92';
                      let phoneNumber = e.target.value;
                      
                      // Remove leading zero if present
                      if (phoneNumber.startsWith('0')) {
                        phoneNumber = phoneNumber.substring(1);
                      }
                      
                      form.setFieldValue('phone', `${countryCode}${phoneNumber}`);
                    }}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="department_id"
              label="Department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select placeholder="Select employee department" allowClear>
                {departments.map((dept: any) => (
                  <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Sixth Row: Position, Employment Type, Employment Status */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="position_id"
              label="Position"
              rules={[{ required: true, message: 'Please select position' }]}
            >
              <Select 
                placeholder="Select employee position"
                allowClear
                onChange={(positionId) => {
                  const selectedPosition = positions.find((pos: any) => pos.id === positionId);
                  if (selectedPosition) {
                    form.setFieldValue('position', selectedPosition.title);
                  }
                }}
              >
                {positions.map((pos: any) => (
                  <Option key={pos.id} value={pos.id}>
                    {pos.title} {pos.level && `(${pos.level})`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="position" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="employment_type"
              label="Employment Type"
              rules={[{ required: true, message: 'Please select employment type' }]}
            >
              <Select placeholder="Select employee employment type" allowClear>
                {formOptions?.employmentTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="employment_status"
              label="Employment Status"
              rules={[{ required: true, message: 'Please select employment status' }]}
            >
              <Select placeholder="Select employee employment status" allowClear>
                {formOptions?.employmentStatuses.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Seventh Row: Work Location, Work Type, Work Schedule */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="work_location"
              label="Work Location"
              rules={[{ required: true, message: 'Please select work location' }]}
            >
              <Select placeholder="Select employee work location" allowClear>
                {formOptions?.workLocations.map(location => (
                  <Option key={location.value} value={location.value}>{location.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="work_type"
              label="Work Type"
            >
              <Select placeholder="Select employee work type" allowClear>
                {formOptions?.workTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="work_schedule"
              label="Work Schedule"
            >
              <Select placeholder="Select employee work schedule" allowClear>
                {formOptions?.workSchedules.map(schedule => (
                  <Option key={schedule.value} value={schedule.value}>{schedule.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Eighth Row: Active Status (Only on Edit and Not for Admin/HR) */}
        {isEditing && employee?.role !== 'admin' && employee?.role !== 'hr' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="active"
                label="Account Active"
                rules={[{ required: true, message: 'Please select account status' }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    const isActive = e.target.value;
                    const confirmMessage = isActive 
                      ? "Setting account to Active will allow the user to log in to the system."
                      : "Setting account to Inactive will prevent the user from logging in to the system.";
                    
                    Modal.confirm({
                      title: 'Confirm Account Status Change',
                      content: confirmMessage,
                      onOk: () => {
                        form.setFieldValue('active', isActive);
                      },
                      onCancel: () => {
                        // Revert to previous value
                        form.setFieldValue('active', !isActive);
                      }
                    });
                  }}
                >
                  <Radio value={true}>Yes - User can log in</Radio>
                  <Radio value={false}>No - User cannot log in</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        )}


      </Form>
    </Modal>
  );
};

export default EmployeeModal;