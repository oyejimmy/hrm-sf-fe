import React, { useState, useEffect } from "react";
import { message, Button, Modal } from "antd";
import { LucideEye } from "lucide-react";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import AttendanceClockPanel from "./components/AttendanceClockPanel";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import AttendanceCalendar from "./components/AttendanceCalendar";
import {
  TodayAttendance,
  AttendanceRecord,
  AttendanceNotification,
  AttendanceSummary,
} from "./types";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api/api';
import { useTheme } from "../../../contexts/ThemeContext";
import AttendanceNotificationPanel from "./components/AttendanceNotificationPanel";
import AttendanceOverviewPanel from "./components/AttendanceOverviewPanel";
import { ResponsiveCol, ResponsiveRow, CommonCard } from "./components/styles";
import { attendanceApi } from '../../../services/api/attendanceApi';



const EmployeeAttendance: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Use the same queries as dashboard
  const { data: todayAttendance, isLoading: todayLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => api.get('/api/attendance/today').then(res => res.data),
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: attendanceHistory = [], isLoading: historyLoading, error } = useQuery({
    queryKey: ['attendance', 'records'],
    queryFn: async () => {
      try {
        console.log('Fetching attendance records...');
        const response = await api.get('/api/attendance/records?limit=30');
        console.log('Direct API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    retry: 1,
    select: (data) => {
      console.log('Select function - raw data:', data);
      if (!data || !Array.isArray(data)) return [];
      const mapped = data.map((record: any) => ({
        id: record.id.toString(),
        employeeId: 'current-user',
        employeeName: 'Current User',
        department: 'Employee',
        date: record.date,
        checkIn: record.check_in,
        checkOut: record.check_out,
        breakStart: record.break_details?.[0]?.start_time,
        breakEnd: record.break_details?.[0]?.end_time,
        status: record.status,
        workingHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) : 0,
        totalHours: record.hours_worked ? parseFloat(record.hours_worked.replace(/[^0-9.]/g, '')) : 0,
        breakMinutes: record.total_break_minutes || 0,
        notes: record.notes,
        isManualEntry: false,
      }));
      console.log('Mapped data:', mapped);
      return mapped;
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ['attendance', 'notifications'],
    queryFn: attendanceApi.getAttendanceNotifications,
  });

  // Use the same mutations as dashboard
  const checkInMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-in'),
    onSuccess: () => {
      message.success('Checked in successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check in');
    }
  });
  
  const checkOutMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-out'),
    onSuccess: () => {
      message.success('Checked out successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check out');
    }
  });
  
  const startBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/start'),
    onSuccess: () => {
      message.success('Break started!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to start break');
    }
  });
  
  const endBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/end'),
    onSuccess: () => {
      message.success('Break ended!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'records'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to end break');
    }
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: attendanceApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'notifications'] });
    },
  });

  const isLoading = todayLoading || historyLoading;

  const [summary, setSummary] = useState<AttendanceSummary>();
  const { isDarkMode } = useTheme();
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false); // State for modal visibility

  // Use only actual API data
  const currentTodayAttendance = todayAttendance;
  const currentAttendanceRecords = attendanceHistory;
  const currentNotifications = notifications || [];

  // Update summary based on actual data
  useEffect(() => {
    if (attendanceHistory && attendanceHistory.length > 0) {
      const presentDays = attendanceHistory.filter((r: any) => r.status === 'present').length;
      const absentDays = attendanceHistory.filter((r: any) => r.status === 'absent').length;
      const lateDays = attendanceHistory.filter((r: any) => r.status === 'late').length;
      const totalDays = attendanceHistory.length;
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      const totalWorkingHours = attendanceHistory.reduce((sum: number, r: any) => sum + (r.workingHours || 0), 0);
      
      setSummary({
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        totalWorkingHours,
        averageWorkingHours: totalDays > 0 ? totalWorkingHours / totalDays : 0,
        attendancePercentage: Math.round(attendancePercentage * 10) / 10,
      });
    }
  }, [attendanceHistory]);



  const handleAttendanceUpdate = (action: string) => {
    switch (action) {
      case "check_in":
        checkInMutation.mutate();
        break;
      case "check_out":
        checkOutMutation.mutate();
        break;
      case "break_start":
        startBreakMutation.mutate();
        break;
      case "break_end":
        endBreakMutation.mutate();
        break;
      default:
        console.warn('Unknown attendance action:', action);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = currentNotifications.filter(
      (n: AttendanceNotification) => !n.read
    );
    const promises = unreadNotifications.map((n: AttendanceNotification) =>
      markNotificationReadMutation.mutateAsync(n.id)
    );
    await Promise.all(promises);
    message.success("All notifications marked as read");
  };

  const showCalendarModal = () => {
    setIsCalendarModalVisible(true);
  };

  const handleCalendarModalCancel = () => {
    setIsCalendarModalVisible(false);
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
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
          >
            View Attendance Summary
          </Button>,
        ]}
      />

      {/* Main Content: Clock, Notifications, and Overview in a single row */}
      <ResponsiveRow gutter={[16, 16]}>
        <ResponsiveCol xs={24} md={12} lg={8} style={{ height: '480px' }}>
          <AttendanceClockPanel
            isDarkMode={isDarkMode}
            todayAttendance={currentTodayAttendance}
            onAttendanceUpdate={handleAttendanceUpdate}
            loading={isLoading}
            isCheckingIn={checkInMutation.isPending}
            isCheckingOut={checkOutMutation.isPending}
            isStartingBreak={startBreakMutation.isPending}
            isEndingBreak={endBreakMutation.isPending}
          />
        </ResponsiveCol>
        <ResponsiveCol xs={24} md={12} lg={8} style={{ height: '480px' }}>
          <AttendanceOverviewPanel summary={summary || { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, totalWorkingHours: 0, averageWorkingHours: 0, attendancePercentage: 0 }} loading={isLoading} />
        </ResponsiveCol>
        <ResponsiveCol xs={24} md={24} lg={8} style={{ height: '480px' }}>
          <AttendanceNotificationPanel
            notifications={currentNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </ResponsiveCol>
      </ResponsiveRow>

      {/* History Section */}
      <CommonCard isDarkMode={isDarkMode} title="Recent Attendance Records">
        <div style={{ padding: "24px" }}>
          <AttendanceHistoryTable
            records={currentAttendanceRecords}
            loading={isLoading}
            showEmployeeColumn={false}
            allowEdit={false}
          />
        </div>
      </CommonCard>

      {/* Attendance Calendar Modal */}
      <Modal
        title="Attendance Calendar"
        open={isCalendarModalVisible}
        onCancel={handleCalendarModalCancel}
        footer={
          <Button type="primary" onClick={handleCalendarModalCancel}>
            Cancel
          </Button>
        }
        width={1000}
        centered
      >
        <AttendanceCalendar
          isDarkMode={isDarkMode}
          records={currentAttendanceRecords}
        />
      </Modal>
    </Wrapper>
  );
};

export default EmployeeAttendance;
