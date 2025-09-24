import React from 'react';
import { Form, Input, Select, Button, Card, Row, Col, Typography, Space } from 'antd';
import { UserOutlined, PhoneOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../../services/api/authApi';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserInfoFormData {
  first_name: string;
  last_name: string;
  phone: string;
  department: string;
  position: string;
  role: string;
}

const UserInfoForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const completeProfileMutation = useMutation({
    mutationFn: (data: UserInfoFormData) => authApi.completeProfile(data),
    onSuccess: () => {
      message.success('Profile completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/employee/dashboard');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to complete profile');
    }
  });

  const onFinish = (values: UserInfoFormData) => {
    completeProfileMutation.mutate(values);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#2958C4', marginBottom: 8 }}>
              Complete Your Profile
            </Title>
            <Text type="secondary">
              Please provide your information to get started with the HRM system
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter first name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="last_name"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter last name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[+]?[\d\s\-()]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Enter phone number"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true, message: 'Please select your department' }]}
                >
                  <Select 
                    placeholder="Select department"
                    suffixIcon={<BankOutlined />}
                  >
                    <Option value="Human Resources">Human Resources</Option>
                    <Option value="Information Technology">Information Technology</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="Sales">Sales</Option>
                    <Option value="Operations">Operations</Option>
                    <Option value="Customer Service">Customer Service</Option>
                    <Option value="Research & Development">Research & Development</Option>
                    <Option value="Legal">Legal</Option>
                    <Option value="Administration">Administration</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[{ required: true, message: 'Please enter your position' }]}
                >
                  <Input 
                    prefix={<TeamOutlined />} 
                    placeholder="Enter your position"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select your role' }]}
              initialValue="employee"
            >
              <Select placeholder="Select role">
                <Option value="employee">Employee</Option>
                <Option value="team_lead">Team Lead</Option>
                <Option value="hr">HR</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={completeProfileMutation.isPending}
                style={{ 
                  height: 48,
                  background: '#2958C4',
                  borderColor: '#2958C4'
                }}
              >
                Complete Profile
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default UserInfoForm;