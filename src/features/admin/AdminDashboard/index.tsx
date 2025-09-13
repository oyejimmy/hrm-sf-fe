import React, { useState } from 'react';
import {
  Layout, Card, Row, Col, Statistic, Progress, List, Avatar,
  Tag, Button, Badge, Dropdown, Menu, Space
} from 'antd';
import {
  UserOutlined, TeamOutlined, CalendarOutlined,
  FileTextOutlined, IdcardOutlined, BarChartOutlined,
  BookOutlined, BellOutlined
} from '@ant-design/icons';
import Chart from 'react-apexcharts';
import styled from 'styled-components';
import HeaderComponent from '../../../components/PageHeader';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wrapper } from '../../../components/Wrapper';

const StatsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  
  .ant-card-body {
    padding: 20px;
  }
`;

const ChartContainer = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 20px;
  }
`;

const NotificationItem = styled(List.Item)`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0 !important;
  
  &:last-child {
    border-bottom: none !important;
  }
`;

const QuickActionButton = styled(Button)`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

// Dashboard Component
const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  // Mock data for charts
  const departmentData: any = {
    options: {
      labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Support'],
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
      legend: {
        position: 'bottom' as const,
      },
    },
    series: [44, 55, 41, 17, 15],
  };

  const attendanceData = {
    options: {
      chart: {
        id: 'attendance-chart',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      colors: ['#1890ff'],
    },
    series: [
      {
        name: 'Attendance Rate',
        data: [95, 92, 90, 88, 96, 94, 93, 97, 96, 98, 97, 99],
      },
    ],
  };

  // Notifications data
  const notifications = [
    {
      title: 'New employee onboarding',
      description: 'John Doe joined Engineering team',
      time: '2 hours ago',
      icon: <TeamOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Leave request',
      description: 'Sarah Connor requested sick leave',
      time: '5 hours ago',
      icon: <CalendarOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Performance review',
      description: 'Quarterly reviews are due next week',
      time: '1 day ago',
      icon: <BarChartOutlined />,
      color: '#faad14',
    },
    {
      title: 'System update',
      description: 'New HR system update available',
      time: '2 days ago',
      icon: <BellOutlined />,
      color: '#f5222d',
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'Add Employee',
      icon: <UserOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Process Payroll',
      icon: <FileTextOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Manage Leaves',
      icon: <CalendarOutlined />,
      color: '#faad14',
    },
    {
      title: 'Generate Reports',
      icon: <BarChartOutlined />,
      color: '#f5222d',
    },
  ];

  // Create notification dropdown menu
  const notificationMenu = (
    <Menu>
      {notifications.map((item, index) => (
        <Menu.Item key={index}>
          <List.Item.Meta
            avatar={<Avatar style={{ backgroundColor: item.color }} icon={item.icon} />}
            title={item.title}
            description={item.description}
          />
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.time}</div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Dashboard"
        subtitle="Welcome back, Admin! Here's what's happening with your team today."
      />

      {/* Stats Overview */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Total Employees"
              value={158}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
            <Progress percent={100} showInfo={false} status="active" />
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>+5 from last week</div>
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Present Today"
              value={142}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
            <Progress percent={90} showInfo={false} status="active" strokeColor="#52c41a" />
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>16 on leave</div>
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Open Positions"
              value={12}
              valueStyle={{ color: '#faad14' }}
              prefix={<IdcardOutlined />}
            />
            <Progress percent={60} showInfo={false} status="active" strokeColor="#faad14" />
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>4 new this week</div>
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title="Training Courses"
              value={8}
              valueStyle={{ color: '#722ed1' }}
              prefix={<BookOutlined />}
            />
            <Progress percent={80} showInfo={false} status="active" strokeColor="#722ed1" />
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>2 completed this month</div>
          </StatsCard>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <ChartContainer title="Department Distribution">
            <Chart
              options={departmentData.options}
              series={departmentData.series}
              type="pie"
              height={350}
            />
          </ChartContainer>
        </Col>
        <Col xs={24} lg={12}>
          <ChartContainer title="Monthly Attendance Rate">
            <Chart
              options={attendanceData.options}
              series={attendanceData.series}
              type="bar"
              height={350}
            />
          </ChartContainer>
        </Col>
      </Row>

      {/* Quick Actions and Notifications */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <ChartContainer title="Quick Actions">
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={12} key={index}>
                  <QuickActionButton
                    type="primary"
                    style={{ backgroundColor: action.color, borderColor: action.color }}
                    icon={action.icon}
                  >
                    {action.title}
                  </QuickActionButton>
                </Col>
              ))}
            </Row>
          </ChartContainer>
        </Col>
        <Col xs={24} lg={12}>
          <ChartContainer
            title="Recent Notifications"
            extra={<Button type="link">View All</Button>}
          >
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <NotificationItem>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: item.color }} icon={item.icon} />}
                    title={item.title}
                    description={item.description}
                  />
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.time}</div>
                </NotificationItem>
              )}
            />
          </ChartContainer>
        </Col>
      </Row>

      {/* Recent Activity */}
      <ChartContainer title="Recent Activity" style={{ marginTop: '24px' }}>
        <List
          dataSource={[
            {
              title: 'Performance review completed',
              description: 'John Doe received a performance review',
              time: 'Today, 10:30 AM',
              status: 'completed',
            },
            {
              title: 'New hire processed',
              description: 'Sarah Connor joined the Engineering team',
              time: 'Yesterday, 3:45 PM',
              status: 'completed',
            },
            {
              title: 'Leave request pending',
              description: 'Mike Johnson requested vacation leave',
              time: 'Oct 12, 2023',
              status: 'pending',
            },
            {
              title: 'Training session scheduled',
              description: 'Leadership training scheduled for Nov 15',
              time: 'Oct 10, 2023',
              status: 'upcoming',
            },
          ]}
          renderItem={(item) => (
            <NotificationItem>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <Space>
                <Tag
                  color={
                    item.status === 'completed'
                      ? 'green'
                      : item.status === 'pending'
                        ? 'orange'
                        : 'blue'
                  }
                >
                  {item.status}
                </Tag>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.time}</div>
              </Space>
            </NotificationItem>
          )}
        />
      </ChartContainer>
    </Wrapper>
  );
};

export default AdminDashboard;