import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Typography, Spin, Alert } from 'antd';
import { 
  Calendar, 
  Clock, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useEmployeeDashboard } from '../../hooks/api/useDashboard';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text } = Typography;

export const EnhancedEmployeeDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { isDarkMode } = useTheme();
  const { data: dashboardData, isLoading, error } = useEmployeeDashboard();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description="Unable to load dashboard data. Please try again later."
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  const cardStyle = {
    background: isDarkMode ? '#1f1f1f' : '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ padding: '24px', background: isDarkMode ? '#141414' : '#f5f5f5' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          Welcome back, {user?.first_name}!
        </Title>
        <Text type="secondary">Here's your dashboard overview</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Leave Balance */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title="Leave Balance"
              value={dashboardData?.leave_balance?.remaining_days || 0}
              suffix="days"
              prefix={<Calendar size={20} color="#52c41a" />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Used: {dashboardData?.leave_balance?.used_days || 0} days
            </Text>
          </Card>
        </Col>

        {/* Attendance Rate */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title="Attendance Rate"
              value={dashboardData?.attendance?.attendance_rate || 0}
              suffix="%"
              prefix={<Clock size={20} color="#1890ff" />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dashboardData?.attendance?.present_days || 0} of {dashboardData?.attendance?.total_working_days || 0} days
            </Text>
          </Card>
        </Col>

        {/* Pending Requests */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title="Pending Requests"
              value={dashboardData?.requests?.pending || 0}
              prefix={<FileText size={20} color="#faad14" />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Awaiting approval
            </Text>
          </Card>
        </Col>

        {/* Training Progress */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title="Training Progress"
              value={dashboardData?.training?.completion_rate || 0}
              suffix="%"
              prefix={<BookOpen size={20} color="#722ed1" />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dashboardData?.training?.completed || 0} of {dashboardData?.training?.total || 0} completed
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        {/* Attendance Overview */}
        <Col xs={24} lg={12}>
          <Card title="Monthly Attendance" style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <Progress
                percent={dashboardData?.attendance?.attendance_rate || 0}
                status={
                  (dashboardData?.attendance?.attendance_rate || 0) >= 90 
                    ? 'success' 
                    : (dashboardData?.attendance?.attendance_rate || 0) >= 75 
                      ? 'normal' 
                      : 'exception'
                }
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Present"
                  value={dashboardData?.attendance?.present_days || 0}
                  valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Total Days"
                  value={dashboardData?.attendance?.total_working_days || 0}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Rate"
                  value={dashboardData?.attendance?.attendance_rate || 0}
                  suffix="%"
                  valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" style={cardStyle}>
            <List
              size="small"
              dataSource={[
                {
                  title: 'Apply for Leave',
                  description: 'Submit a new leave request',
                  icon: <Calendar size={16} color="#52c41a" />,
                  action: 'Apply Now'
                },
                {
                  title: 'View Payslip',
                  description: 'Check your latest payslip',
                  icon: <FileText size={16} color="#1890ff" />,
                  action: 'View'
                },
                {
                  title: 'Training Courses',
                  description: 'Continue your learning journey',
                  icon: <BookOpen size={16} color="#722ed1" />,
                  action: 'Continue'
                },
                {
                  title: 'Submit Request',
                  description: 'Make a new employee request',
                  icon: <AlertCircle size={16} color="#faad14" />,
                  action: 'Submit'
                }
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a key="action" style={{ color: '#1890ff' }}>
                      {item.action}
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Leave Balance Details */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Leave Balance Overview" style={cardStyle}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Total Annual Leave"
                    value={25}
                    suffix="days"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Used"
                    value={dashboardData?.leave_balance?.used_days || 0}
                    suffix="days"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Remaining"
                    value={dashboardData?.leave_balance?.remaining_days || 0}
                    suffix="days"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};