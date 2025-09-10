import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import {
  CheckCircle,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  User,
  BarChart3
} from 'lucide-react';
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
import { useTheme } from '../../../contexts/ThemeContext';
import { theme } from '../../../styles/theme';

const EmployeeDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = theme[isDarkMode ? 'dark' : 'light'];

  const stats: StatCard[] = [
    {
      id: "s1",
      title: "Attendance Rate",
      value: 96.5,
      suffix: "%",
      color: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
      icon: <CheckCircle size={20} color="#fff" style={{ marginRight: '5px' }} />
    },
    {
      id: "s2",
      title: "Leave Balance",
      value: 18,
      suffix: "days",
      color: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
      icon: <Calendar size={20} color="#fff" style={{ marginRight: '5px' }} />
    },
    {
      id: "s3",
      title: "Work Hours",
      value: 162.5,
      suffix: "h",
      color: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
      icon: <Clock size={20} color="#fff" style={{ marginRight: '5px' }} />
    },
    {
      id: "s4",
      title: "Pending Requests",
      value: 2,
      color: "linear-gradient(135deg, #f5222d 0%, #cf1322 100%)",
      icon: <AlertCircle size={20} color="#fff" style={{ marginRight: '5px' }} />
    }
  ];

  const quickActions: any = [
    { id: "q1", label: "Apply Leave", icon: <Calendar size={16} color={currentTheme.colors.primary} />, onClick: () => alert("Leave request") },
    { id: "q2", label: "View Payslip", icon: <FileText size={16} color={currentTheme.colors.primary} />, onClick: () => alert("Payslip view") },
    { id: "q3", label: "Update Profile", icon: <User size={16} color={currentTheme.colors.primary} />, onClick: () => alert("Profile update") },
  ];
  const events: any = [
    { id: "e1", date: "2025-09-10", title: "Team Meeting", type: "Meeting" },
    { id: "e2", date: "2025-09-15", title: "React Training", type: "Training" },
  ];

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <WelcomeHeader isDarkMode={isDarkMode} />
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '16px',
          color: currentTheme.colors.textPrimary 
        }}>
          <BarChart3 size={20} color={currentTheme.colors.primary} style={{ marginRight: '8px' }} />
          <h3 style={{ margin: 0, color: currentTheme.colors.textPrimary }}>My Stats Overview</h3>
        </div>
        <MyStatsOverview stats={stats} />
      </div>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Announcements isDarkMode={isDarkMode} />
        </Col>
        <Col span={8}>
          <RecentActivities isDarkMode={isDarkMode} />
        </Col>
        <Col span={8}>
          <UpcomingHolidays isDarkMode={isDarkMode} />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={24}>
          <TrainingPrograms isDarkMode={isDarkMode} />
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