import React from 'react';
import { Row, Col, Button, Spin } from 'antd';
import HeaderComponent from '../../../components/PageHeader';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wrapper } from '../../../components/Wrapper';
import { useAdminDashboard } from '../../../hooks/api/useReports';
import { StatsOverview } from './components/StatsOverview';
import { ChartsSection } from './components/ChartsSection';
import { QuickActions } from './components/QuickActions';
import { NotificationsPanel } from './components/NotificationsPanel';
import { AnnouncementsSection } from './components/AnnouncementsSection';

// Dashboard Component
const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const { data: dashboardStats, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </Wrapper>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Error loading dashboard data</h3>
          <p>Please try refreshing the page</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </Wrapper>
    );
  }
  const stats = dashboardStats || {
    employees: { total: 0, active: 0, on_leave_today: 0 },
    attendance: { present_today: 0, attendance_rate: 0 },
    leaves: { pending: 0, approved_this_month: 0 },
    requests: { pending: 0 },
    complaints: { pending: 0 },
    departments: [],
    recent_notifications: [],
    recent_announcements: []
  };

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Dashboard"
        subtitle="Welcome back, Admin! Here's what's happening with your team today."
      />

      <StatsOverview stats={stats} />
      <ChartsSection departmentData={stats.departments} />
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={8}>
          <NotificationsPanel notifications={stats.recent_notifications} />
        </Col>
        <Col xs={24} lg={8}>
          <AnnouncementsSection announcements={stats.recent_announcements} />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default AdminDashboard;
