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
import {
  BookOutlined,
  LaptopOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { PageContainer } from './components/styles';
import WelcomeHeader from './components/WelcomeHeader';
import MyStatsOverview from './components/MyStatsOverview';
import Announcements from './components/Announcements';
import RecentActivities from './components/RecentActivities';
import UpcomingHolidays from './components/UpcomingHolidays';
import TrainingPrograms from './components/TrainingRoadmap';
import QuickActions from './components/QuickActions';
import AttendanceTracker from './components/AttendanceTracker';
import type {
  StatCard,
} from './types';
import MySchedule from './components/MySchedule';
import { useTheme } from '../../../contexts/ThemeContext';
import { theme } from '../../../styles/theme';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
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
    { id: "q1", label: "Apply Leave", icon: <Calendar size={16} color={currentTheme.colors.primary} />, onClick: () => navigate('/employee/leave') },
    { id: "q2", label: "View Payslip", icon: <FileText size={16} color={currentTheme.colors.primary} />, onClick: () => navigate('/employee/payslip') },
    { id: "q3", label: "Update Profile", icon: <User size={16} color={currentTheme.colors.primary} />, onClick: () => navigate('/employee/profile/edit') },
    { id: "q4", label: "View Documents", icon: <FileText size={16} color={currentTheme.colors.primary} />, onClick: () => navigate('/employee/documents') },
    { id: "q5", label: "Training", icon: <BookOutlined style={{ color: currentTheme.colors.primary }} />, onClick: () => navigate('/employee/training') },
    { id: "q6", label: "Submit Request", icon: <AlertCircle size={16} color={currentTheme.colors.primary} />, onClick: () => navigate('/employee/request') },
    { id: "q7", label: "View Assets", icon: <LaptopOutlined style={{ color: currentTheme.colors.primary }} />, onClick: () => navigate('/employee/assets') },
    { id: "q8", label: "File Complaint", icon: <FileTextOutlined style={{ color: currentTheme.colors.primary }} />, onClick: () => navigate('/employee/complain') },
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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Announcements isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <RecentActivities isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <UpcomingHolidays isDarkMode={isDarkMode} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <AttendanceTracker isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <QuickActions actions={quickActions} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <TrainingPrograms isDarkMode={isDarkMode} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <MySchedule events={events} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EmployeeDashboard;