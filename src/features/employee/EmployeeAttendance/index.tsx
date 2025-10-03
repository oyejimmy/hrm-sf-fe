import React, { useState } from "react";
import { Button, Modal, Spin, Alert } from "antd";
import { LucideEye } from "lucide-react";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import AttendanceClockPanel from "./components/AttendanceClockPanel";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import AttendanceCalendar from "./components/AttendanceCalendar";
import { useTheme } from "../../../contexts/ThemeContext";
import AttendanceNotificationPanel from "./components/AttendanceNotificationPanel";
import AttendanceOverviewPanel from "./components/AttendanceOverviewPanel";
import { ResponsiveCol, ResponsiveRow, CommonCard } from "./components/styles";
import { 
  useTodayAttendance, 
  useMyAttendanceRecords, 
  useCheckIn, 
  useCheckOut, 
  useStartBreak, 
  useEndBreak 
} from '../../../hooks/api/useAttendance';

const EmployeeAttendance: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  // API Hooks
  const { data: todayAttendance, isLoading: todayLoading, error: todayError } = useTodayAttendance();
  const { data: attendanceHistory = [], isLoading: historyLoading, error: historyError } = useMyAttendanceRecords(30);
  
  // Mutations
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const startBreakMutation = useStartBreak();
  const endBreakMutation = useEndBreak();

  const isLoading = todayLoading || historyLoading;
  const hasError = todayError || historyError;

  // Transform attendance history for the table
  const transformedHistory = attendanceHistory.map((record: any) => ({
    id: record.id?.toString() || Math.random().toString(),
    employeeId: 'current-user',
    employeeName: 'Current User',
    department: 'Employee',
    date: record.date,
    checkIn: record.check_in,
    checkOut: record.check_out,
    breakStart: record.break_details?.[0]?.start_time,
    breakEnd: record.break_details?.[0]?.end_time,
    status: record.status || 'present',
    workingHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) || 0 : 0,
    totalHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) || 0 : 0,
    breakMinutes: record.total_break_minutes || 0,
    notes: record.notes || '',
    isManualEntry: false,
  }));

  const handleAttendanceUpdate = (action: string) => {
    switch (action) {
      case "check_in":
        checkInMutation.mutate();
        break;
      case "check_out":
        checkOutMutation.mutate();
        break;
      case "break_start":
        startBreakMutation.mutate('general');
        break;
      case "break_end":
        endBreakMutation.mutate();
        break;
      default:
        console.warn('Unknown attendance action:', action);
    }
  };



  const showCalendarModal = () => {
    setIsCalendarModalVisible(true);
  };

  const handleCalendarModalCancel = () => {
    setIsCalendarModalVisible(false);
  };

  // Show error state if there's an error
  if (hasError) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <HeaderComponent
          isDarkMode={isDarkMode}
          title="Employee Attendance System"
          subtitle="Track your daily attendance with real-time clock and comprehensive history"
          breadcrumbItems={[
            { title: "Dashboard", href: "/" },
            { title: "Employee Attendance" },
          ]}
        />
        <Alert
          message="Error Loading Attendance Data"
          description="There was an issue loading your attendance information. Please try refreshing the page or contact support if the problem persists."
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Employee Attendance System"
        subtitle="Track your daily attendance with real-time clock and comprehensive history"
        breadcrumbItems={[
          { title: "Dashboard", href: "/" },
          { title: "Employee Attendance" },
        ]}
        extraButtons={[
          <Button
            key="view-calendar"
            type="primary"
            icon={<LucideEye />}
            onClick={showCalendarModal}
            disabled={isLoading}
          >
            View Attendance Summary
          </Button>,
        ]}
      />

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading attendance data...</div>
        </div>
      )}

      {/* Main Content: Clock, Notifications, and Overview in a single row */}
      {!isLoading && (
        <>
          <ResponsiveRow gutter={[16, 16]}>
            <ResponsiveCol xs={24} md={12} lg={8} style={{ height: '480px' }}>
              <AttendanceClockPanel
                isDarkMode={isDarkMode}
                todayAttendance={todayAttendance}
                onAttendanceUpdate={handleAttendanceUpdate}
                loading={todayLoading}
                isCheckingIn={checkInMutation.isPending}
                isCheckingOut={checkOutMutation.isPending}
                isStartingBreak={startBreakMutation.isPending}
                isEndingBreak={endBreakMutation.isPending}
              />
            </ResponsiveCol>
            <ResponsiveCol xs={24} md={12} lg={8} style={{ height: '480px' }}>
              <AttendanceOverviewPanel />
            </ResponsiveCol>
            <ResponsiveCol xs={24} md={24} lg={8} style={{ height: '480px' }}>
              <AttendanceNotificationPanel />
            </ResponsiveCol>
          </ResponsiveRow>

          {/* History Section */}
          <CommonCard isDarkMode={isDarkMode} title="Recent Attendance Records">
            <div style={{ padding: "24px" }}>
              <AttendanceHistoryTable
                records={transformedHistory}
                loading={historyLoading}
                showEmployeeColumn={false}
              />
            </div>
          </CommonCard>
        </>
      )}

      {/* Attendance Calendar Modal */}
      <Modal
        title="Attendance Calendar"
        open={isCalendarModalVisible}
        onCancel={handleCalendarModalCancel}
        footer={
          <Button type="primary" onClick={handleCalendarModalCancel}>
            Close
          </Button>
        }
        width={1000}
        centered
      >
        <AttendanceCalendar isDarkMode={isDarkMode} />
      </Modal>
    </Wrapper>
  );
};

export default EmployeeAttendance;
