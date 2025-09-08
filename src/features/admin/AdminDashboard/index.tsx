import React from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tag,
  Button,
  Typography,
  Progress,
  Badge,
  Divider
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  DashboardOutlined,
  BellOutlined,
  PlusOutlined,
  ScheduleOutlined,
  BookOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import HeaderComponent from '../../../components/PageHeader';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const StyledHeader = styled(Header)`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  display: flex;
  align-items: center;
  z-index: 1;
`;

const PageTitle = styled(Title)`
  margin: 0 !important;
  color: #262626 !important;
`;

const DashboardContent = styled(Content)`
  padding: 24px;
`;

const StatisticCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  .ant-card-body {
    padding: 20px;
  }
`;

const SectionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-card-head-title {
    font-weight: 600;
    color: #262626;
  }
`;

const QuickActionButton = styled(Button)`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  transition: all 0.3s;
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const PendingApprovalItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const AnnouncementItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const HolidayItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  // Sample data
  const pendingApprovals = [
    { name: 'John Ben', department: 'Engineering', time: 'Now 12-18' },
    { name: 'Wact Ben', department: 'Designer', time: 'Now 09-18' },
    { name: 'Sheils', department: 'QA', time: 'Now 17-18' },
  ];

  const announcements = [
    { title: 'Holiday Notice', content: 'Company will be closed on December 25th for Christmas' },
    { title: 'Policy Update', content: 'New Work-from-home policy effective January 1st' },
    { title: 'Holiday Notice', content: 'Schedule maintenance on Sunday 2AM–4AM' },
  ];

  const holidays = [
    { name: 'Labour Day', date: 'November 1, 2025 Tuesday' },
    { name: 'Independence Day', date: 'March 04, 2025 Friday' },
    { name: 'Eid Ul Fitr', date: 'April 23, 2025 Monday' },
  ];

  const activities = [
    { action: 'Sarah Johnson submitted a leave request', time: '2 hours ago' },
    { action: 'New candidate applied for Frontend Developer Position', time: '5 hours ago' },
    { action: 'React.js Training Module completed by 15 employees', time: '1 day ago' },
  ];

  const quickActions = [
    { icon: <PlusOutlined />, label: 'Add Employee' },
    { icon: <ScheduleOutlined />, label: 'Schedule Interview' },
    { icon: <BookOutlined />, label: 'Create Training' },
    { icon: <FileTextOutlined />, label: 'Generate Report' },
  ];

  return (
    <StyledLayout>
      <HeaderComponent
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening at our company today."
      />


      <DashboardContent>
        <Row gutter={[24, 24]}>
          {/* Statistics Cards */}
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard>
              <Statistic
                title="Total Employees"
                value={248}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard>
              <Statistic
                title="Active Today"
                value={235}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard>
              <Statistic
                title="On Leave"
                value={13}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </StatisticCard>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text>Performance Score</Text>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  <Progress
                    type="circle"
                    percent={84}
                    width={50}
                    format={percent => `8.4/10`}
                    strokeColor="#722ed1"
                  />
                </div>
              </div>
            </StatisticCard>
          </Col>

          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Announcements */}
            <SectionCard title="Announcements" extra={<BellOutlined />}>
              {announcements.map((announcement, index) => (
                <AnnouncementItem key={index}>
                  <Text strong>{announcement.title}</Text>
                  <br />
                  <Text type="secondary">{announcement.content}</Text>
                </AnnouncementItem>
              ))}
            </SectionCard>

            {/* Recent Activities */}
            <SectionCard title="Recent Activities">
              {activities.map((activity, index) => (
                <ActivityItem key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{activity.action}</Text>
                    <Text type="secondary">{activity.time}</Text>
                  </div>
                </ActivityItem>
              ))}
            </SectionCard>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Upcoming Holidays */}
            <SectionCard title="Upcoming Holidays">
              {holidays.map((holiday, index) => (
                <HolidayItem key={index}>
                  <Text strong>{holiday.name}</Text>
                  <br />
                  <Text type="secondary">{holiday.date}</Text>
                </HolidayItem>
              ))}
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title="Quick Action">
              <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                  <Col xs={12} key={index}>
                    <QuickActionButton>
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                        {action.icon}
                      </div>
                      <Text>{action.label}</Text>
                    </QuickActionButton>
                  </Col>
                ))}
              </Row>
            </SectionCard>

            {/* Pending Approvals */}
            <SectionCard title="Pending Approvals">
              {pendingApprovals.map((approval, index) => (
                <PendingApprovalItem key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>{approval.name}</Text>
                      <br />
                      <Text type="secondary">{approval.department}</Text>
                    </div>
                    <Tag color="orange">{approval.time}</Tag>
                  </div>
                </PendingApprovalItem>
              ))}
            </SectionCard>
          </Col>
        </Row>
      </DashboardContent>
    </StyledLayout>
  );
};

export default AdminDashboard;