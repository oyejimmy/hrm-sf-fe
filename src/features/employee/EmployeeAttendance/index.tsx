import React, { useState, useEffect } from 'react';
import { Row, Col, message, Card, Space, Typography } from 'antd';
import { Clock, BarChart3, History, Bell, Calendar } from 'lucide-react';
import styled from 'styled-components';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';

import AttendanceClockPanel from './components/AttendanceClockPanel';
import AttendanceHistoryTable from './components/AttendanceHistoryTable';
import AttendanceNotificationPanel from './components/AttendanceNotificationPanel';
import AttendanceStatsPanel from './components/AttendanceStatsPanel';
import AttendanceCalendar from './components/AttendanceCalendar';
import { 
  TodayAttendance, 
  AttendanceRecord, 
  AttendanceNotification, 
  AttendanceSummary 
} from './types';
import { useAttendance } from '../../../hooks/useAttendance';
import { useTheme } from '../../../contexts/ThemeContext';

const { Title } = Typography;

const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border: none;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  overflow: hidden;
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#2a2a2a' : '#f0f0f0'};
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#fafafa'};
  }
  
  .ant-card-head-title {
    color: var(--text-color);
    font-weight: 600;
    font-size: 18px;
  }
  
  .ant-card-body {
    padding: 0;
  }
`;

const SectionTitle = styled(Title)`
  color: var(--text-color) !important;
  margin: 40px 0 20px 0 !important;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700 !important;
  position: relative;
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #2958C4 0%, transparent 100%);
    margin-left: 16px;
  }
  
  @media (max-width: 768px) {
    font-size: 18px !important;
    margin: 32px 0 16px 0 !important;
  }
`;

const ResponsiveRow = styled(Row)`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin: 0 -8px 16px -8px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    padding: 0 8px;
    margin-bottom: 16px;
  }
`;

const MainContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Mock data
const mockTodayAttendance: TodayAttendance = {
  date: new Date().toISOString().split('T')[0],
  checkIn: undefined,
  checkOut: undefined,
  breakStart: undefined,
  breakEnd: undefined,
  totalHours: 0,
  breakMinutes: 0,
  workingHours: 0,
  status: 'Pending',
  isOnBreak: false
};

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'Current User',
    department: 'Engineering',
    date: '2024-01-15',
    checkIn: '2024-01-15T09:00:00Z',
    checkOut: '2024-01-15T18:00:00Z',
    breakStart: '2024-01-15T12:00:00Z',
    breakEnd: '2024-01-15T13:00:00Z',
    totalHours: 9,
    breakMinutes: 60,
    workingHours: 8,
    status: 'Present',
    notes: 'Regular day'
  }
];

const mockNotifications: AttendanceNotification[] = [
  {
    id: '1',
    type: 'check_in',
    employeeId: 'emp1',
    employeeName: 'Current User',
    department: 'Engineering',
    message: 'You checked in at 9:00 AM',
    timestamp: '2 hours ago',
    read: false,
    priority: 'low'
  }
];

const mockSummary: AttendanceSummary = {
  totalDays: 22,
  presentDays: 20,
  absentDays: 2,
  lateDays: 3,
  totalWorkingHours: 160,
  averageWorkingHours: 8,
  attendancePercentage: 90.9
};

const EmployeeAttendance: React.FC = () => {
  const { 
    todayAttendance, 
    attendanceHistory, 
    notifications, 
    isLoading, 
    logAttendance, 
    markNotificationAsRead 
  } = useAttendance();
  
  const [summary, setSummary] = useState<AttendanceSummary>(mockSummary);
  const { isDarkMode } = useTheme();

  // Use actual data or fallback to mock data
  const currentTodayAttendance = todayAttendance || mockTodayAttendance;
  const currentAttendanceRecords = attendanceHistory || mockAttendanceRecords;
  const currentNotifications = notifications || mockNotifications;

  useEffect(() => {
    // Auto-absence check at 12:00 PM
    const now = new Date();
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    
    if (now > noon && !currentTodayAttendance.checkIn) {
      handleAutoAbsence();
    }
  }, [currentTodayAttendance]);

  const handleAutoAbsence = async () => {
    try {
      // This would be handled by the API
      message.warning('You have been marked absent for today. Please contact HR if this is incorrect.');
    } catch (error) {
      console.error('Failed to auto-mark absent:', error);
    }
  };

  const handleAttendanceUpdate = (updatedAttendance: TodayAttendance) => {
    // This will be handled by the mutation in useAttendance hook
    const attendanceData = {
      action: updatedAttendance.checkOut ? 'check_out' : 
              updatedAttendance.isOnBreak ? 'break_start' : 'check_in',
      timestamp: new Date().toISOString()
    };
    logAttendance(attendanceData as any);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = currentNotifications.filter((n: AttendanceNotification) => !n.read);
    const promises = unreadNotifications.map((n: AttendanceNotification) => markNotificationAsRead(n.id));
    await Promise.all(promises);
    message.success('All notifications marked as read');
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <HeaderComponent
          isDarkMode={isDarkMode}
          title="Employee Attendance System"
          subtitle="Track your daily attendance with real-time clock and comprehensive history"
          breadcrumbItems={[
            { title: 'Home', href: '/' },
            { title: 'Employee', href: '/employee' }
          ]}
        />

        {/* Attendance Clock Section */}
        <ResponsiveRow gutter={[24, 24]}>
          <ResponsiveCol xs={24} lg={16}>
            <AttendanceClockPanel
              todayAttendance={currentTodayAttendance}
              onAttendanceUpdate={handleAttendanceUpdate}
              loading={isLoading}
            />
          </ResponsiveCol>
          <ResponsiveCol xs={24} lg={8}>
            <AttendanceNotificationPanel
              notifications={currentNotifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </ResponsiveCol>
        </ResponsiveRow>

        {/* Statistics Section */}
        <SectionTitle level={3}>
          <BarChart3 size={20} />
          Attendance Statistics
        </SectionTitle>
        <AttendanceStatsPanel
          summary={summary}
          loading={isLoading}
          showEmployeeStats={true}
        />

        {/* History Section */}
        <SectionTitle level={3}>
          <History size={20} />
          Attendance History
        </SectionTitle>
        <StyledCard isDarkMode={isDarkMode} title="Recent Attendance Records">
          <div style={{ padding: '24px' }}>
            <AttendanceHistoryTable
              records={currentAttendanceRecords}
              loading={isLoading}
              showEmployeeColumn={false}
              allowEdit={false}
            />
          </div>
        </StyledCard>

        {/* Calendar Section */}
        <SectionTitle level={3}>
          <Calendar size={20} />
          Attendance Calendar
        </SectionTitle>
        <StyledCard isDarkMode={isDarkMode} title="Monthly Attendance View">
          <div style={{ padding: '24px' }}>
            <AttendanceCalendar records={currentAttendanceRecords} />
          </div>
        </StyledCard>
      </ContentWrapper>
    </MainContainer>
  );
};

export default EmployeeAttendance;