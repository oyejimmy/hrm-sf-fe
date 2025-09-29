import React, { useState, useEffect } from "react";
import { message, Button, Modal } from "antd";
import { LucideEye } from "lucide-react";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import AttendanceClockPanel from "./components/AttendanceClockPanel";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import AttendanceCalendar from "./components/AttendanceCalendar";
import {
  AttendanceRecord,
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
  
  // Fetch today's attendance
  const { data: todayAttendance, isLoading: todayLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => api.get('/api/attendance/today').then(res => res.data),
    refetchInterval: 30000,
    retry: 1,
  });

  // Fetch attendance history
  const { data: attendanceHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['attendance', 'records'],
    queryFn: async () => {
      const response = await api.get('/api/attendance/records?limit=30');
      return response.data;
    },
    retry: 1,
    select: (data) => {
      if (!data || !Array.isArray(data)) return [];
      return data.map((record: any) => ({
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
    },
  });

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['attendance', 'notifications'],
    queryFn: attendanceApi.getAttendanceNotifications,
  });

  // Mutations for attendance actions
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

  const isLoading = todayLoading || historyLoading;
  const { isDarkMode } = useTheme();
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);



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
            todayAttendance={todayAttendance}
            onAttendanceUpdate={handleAttendanceUpdate}
            loading={isLoading}
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
            records={attendanceHistory}
            loading={isLoading}
            showEmployeeColumn={false}
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
        />
      </Modal>
    </Wrapper>
  );
};

export default EmployeeAttendance;
