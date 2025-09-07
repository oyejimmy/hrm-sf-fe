import React from 'react';
import { Row, Col, Card, Statistic, Table, Button, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  TrophyOutlined,
  PlusOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title } = Typography;

const DashboardContainer = styled.div`
  padding: 24px;
`;

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .ant-statistic-title {
    color: #8c8c8c;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    color: #262626;
    font-size: 24px;
    font-weight: 600;
  }
`;

const QuickActionsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Button)`
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  
  .anticon {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const RecentActivitiesCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const AdminDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Employees',
      value: 1250,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Active Today',
      value: 1180,
      icon: <ClockCircleOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'On Leave',
      value: 45,
      icon: <CalendarOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: 'Avg Performance',
      value: 87.5,
      suffix: '%',
      icon: <TrophyOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    }
  ];

  const quickActions = [
    {
      title: 'Add Employee',
      icon: <PlusOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Schedule Interview',
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Create Training',
      icon: <FileTextOutlined />,
      color: '#faad14'
    },
    {
      title: 'Generate Report',
      icon: <FileTextOutlined />,
      color: '#722ed1'
    }
  ];

  const recentActivities = [
    {
      key: '1',
      activity: 'John Doe requested annual leave',
      time: '2 hours ago',
      type: 'leave_request',
      status: 'pending'
    },
    {
      key: '2',
      activity: 'Sarah Wilson completed training program',
      time: '4 hours ago',
      type: 'training',
      status: 'completed'
    },
    {
      key: '3',
      activity: 'Mike Johnson logged attendance',
      time: '6 hours ago',
      type: 'attendance',
      status: 'present'
    },
    {
      key: '4',
      activity: 'Lisa Brown submitted performance review',
      time: '1 day ago',
      type: 'performance',
      status: 'submitted'
    }
  ];

  const columns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ 
          color: status === 'pending' ? '#faad14' : 
                status === 'completed' ? '#52c41a' : 
                status === 'present' ? '#52c41a' : '#1890ff'
        }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <DashboardContainer>
      <Title level={2} style={{ marginBottom: 24 }}>
        Admin Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </StatCard>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <QuickActionsCard title="Quick Actions">
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={12} sm={6} key={index}>
                  <ActionButton
                    type="default"
                    style={{ 
                      borderColor: action.color,
                      color: action.color,
                      width: '100%'
                    }}
                  >
                    {action.icon}
                    <span style={{ fontSize: '12px' }}>{action.title}</span>
                  </ActionButton>
                </Col>
              ))}
            </Row>
          </QuickActionsCard>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <RecentActivitiesCard title="Recent Activities">
            <Table
              dataSource={recentActivities}
              columns={columns}
              pagination={false}
              size="small"
            />
          </RecentActivitiesCard>
        </Col>
      </Row>

      {/* Announcements */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Announcements" style={{ borderRadius: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <strong>Company Meeting</strong>
                <p style={{ margin: '4px 0', color: '#8c8c8c' }}>
                  All-hands meeting scheduled for Friday at 2 PM in the main conference room.
                </p>
                <small style={{ color: '#8c8c8c' }}>Posted 2 days ago</small>
              </div>
              <div>
                <strong>New Policy Update</strong>
                <p style={{ margin: '4px 0', color: '#8c8c8c' }}>
                  Updated remote work policy effective from next month.
                </p>
                <small style={{ color: '#8c8c8c' }}>Posted 1 week ago</small>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </DashboardContainer>
  );
};
