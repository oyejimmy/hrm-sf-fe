// features/employee/Attendance/types/index.ts

export type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave" | "Pending";

export interface AttendanceRecord {
  id: string;
  date: string;            // ISO date (YYYY-MM-DD)
  checkIn?: string;        // time string, e.g., "09:05 AM"
  checkOut?: string;       // time string
  totalHours?: number;     // decimal hours
  breakMinutes?: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface TodayAttendance {
  date: string;
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  breakMinutes?: number;
  status: AttendanceStatus;
}

export interface LeaveBalance {
  type: string;
  taken: number;
  remaining: number;
}

export interface ScheduleEvent {
  id: string;
  date: string; // ISO date or friendly
  title: string;
  type: "Meeting" | "Training" | "Deadline" | "Event";
}

export interface AttendanceNotification {
  id: string;
  message: string;
  date: string; // friendly
  read?: boolean;
  level?: "info" | "warning" | "critical";
}
