import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';

const EmployeeDashboard: React.FC = () => {
  return (
    <div>
      <h1>Employee Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hours This Month"
              value={168}
              prefix={<ClockCircleOutlined />}
              suffix="hrs"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Leave Balance"
              value={15}
              prefix={<CalendarOutlined />}
              suffix="days"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Requests"
              value={2}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Training Courses"
              value={3}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions" size="small">
            <Button type="primary" block style={{ marginBottom: 8 }}>
              Clock In/Out
            </Button>
            <Button block style={{ marginBottom: 8 }}>
              Request Leave
            </Button>
            <Button block>
              View Payslip
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Activities" size="small">
            <p>• Clocked in at 9:00 AM</p>
            <p>• Leave request approved</p>
            <p>• Training course completed</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;