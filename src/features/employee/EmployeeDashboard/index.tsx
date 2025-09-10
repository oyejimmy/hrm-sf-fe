import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import {
  CheckCircleOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { PageContainer } from './components/styles';
import WelcomeHeader from './components/WelcomeHeader';
import MyStatsOverview from './components/MyStatsOverview';
import Announcements from './components/Announcements';
import RecentActivities from './components/RecentActivities';
import UpcomingHolidays from './components/UpcomingHolidays';
import TrainingPrograms from './components/TrainingRoadmap';
import QuickActions from './components/QuickActions';
import type {
  StatCard,
} from './types';
import MySchedule from './components/MySchedule';

const stats: StatCard[] = [
  {
    id: "s1",
    title: "Attendance Rate",
    value: 96.5,
    suffix: "%",
    color: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
    icon: <CheckCircleOutlined style={{ color: '#fff', fontSize: '20px', marginRight: '5px' }} />
  },
  {
    id: "s2",
    title: "Leave Balance",
    value: 18,
    suffix: "days",
    color: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
    icon: <CalendarOutlined style={{ color: '#fff', fontSize: '20px', marginRight: '5px' }} />
  },
  {
    id: "s3",
    title: "Work Hours",
    value: 162.5,
    suffix: "h",
    color: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
    icon: <FieldTimeOutlined style={{ color: '#fff', fontSize: '20px', marginRight: '5px' }} />
  },
  {
    id: "s4",
    title: "Pending Requests",
    value: 2,
    color: "linear-gradient(135deg, #f5222d 0%, #cf1322 100%)",
    icon: <ExclamationCircleOutlined style={{ color: '#fff', fontSize: '20px', marginRight: '5px' }} />
  }
];

const quickActions: any = [
  { id: "q1", label: "Apply Leave", icon: <CalendarOutlined />, onClick: () => alert("Leave request") },
  { id: "q2", label: "View Payslip", icon: <FileTextOutlined />, onClick: () => alert("Payslip view") },
  { id: "q3", label: "Update Profile", icon: <ProfileOutlined />, onClick: () => alert("Profile update") },
];
const events: any = [
  { id: "e1", date: "2025-09-10", title: "Team Meeting", type: "Meeting" },
  { id: "e2", date: "2025-09-15", title: "React Training", type: "Training" },
];

const EmployeeDashboard: React.FC = () => {
  return (
    <PageContainer>
      <WelcomeHeader />
      <MyStatsOverview stats={stats} />
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Announcements />
        </Col>
        <Col span={8}>
          <RecentActivities />
        </Col>
        <Col span={8}>
          <UpcomingHolidays />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={24}>
          <TrainingPrograms />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <QuickActions actions={quickActions} />
        </Col>
        <Col span={12}>
          <MySchedule events={events} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EmployeeDashboard;