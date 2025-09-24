import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Select } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDashboardRoute } from '../../utils/authHelpers';

const { Title, Text } = Typography;
const { Option } = Select;

export const MinimalOnboarding: React.FC = () => {
  const { user, completeProfile, isCompleteProfileLoading } = useAuthContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await completeProfile(values);
      const dashboardRoute = getDashboardRoute(user?.role || 'employee');
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      console.error('Profile completion failed:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: '100%', maxWidth: 600, margin: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Complete Your Profile</Title>
          <Text type="secondary">Please provide your information to continue</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
            role: user?.role || 'employee'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select your department' }]}
          >
            <Select placeholder="Select Department">
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Operations">Operations</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter your position' }]}
          >
            <Input placeholder="Your Position" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select your role' }]}
          >
            <Select placeholder="Select Role">
              <Option value="employee">Employee</Option>
              <Option value="team_lead">Team Lead</Option>
              <Option value="hr">HR</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={isCompleteProfileLoading}
            >
              Complete Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};