export type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave" | "Pending";
export type AttendanceAction = "check_in" | "check_out" | "break_start" | "break_end";
export type ClockType = "digital" | "analog";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // ISO date (YYYY-MM-DD)
  checkIn?: string; // ISO timestamp
  checkOut?: string; // ISO timestamp
  breakStart?: string; // ISO timestamp
  breakEnd?: string; // ISO timestamp
  totalHours: number;
  breakMinutes: number;
  workingHours: number; // Total working hours excluding breaks
  status: AttendanceStatus;
  notes?: string;
  isManualEntry?: boolean;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface TodayAttendance {
  id?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  breakMinutes: number;
  workingHours: number;
  status: AttendanceStatus;
  isOnBreak: boolean;
}

export interface AttendanceNotification {
  id: string;
  type: 'check_in' | 'check_out' | 'break_start' | 'break_end' | 'absence' | 'late_arrival';
  employeeId: string;
  employeeName: string;
  department: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
  attendancePercentage: number;
}

export interface AttendanceStats {
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  onBreak: number;
  totalEmployees: number;
}

export interface BreakRecord {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  type: 'lunch' | 'tea' | 'personal' | 'other';
  notes?: string;
}

export interface AttendanceOverride {
  attendanceId: string;
  field: 'checkIn' | 'checkOut' | 'breakStart' | 'breakEnd' | 'status';
  oldValue: string;
  newValue: string;
  reason: string;
  overriddenBy: string;
  overriddenAt: string;
}