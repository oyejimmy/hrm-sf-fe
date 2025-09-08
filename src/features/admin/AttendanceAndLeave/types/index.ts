export interface Attendance {
  id?: number;
  employeeName: string;
  date: string; // ISO string like "2025-09-08"
  status: "Present" | "Absent" | "Leave";
}

export interface LeaveRequest {
  id?: number;
  employeeName: string;
  leaveType: "Sick" | "Casual" | "Annual";
  startDate: string;
  endDate: string;
  reason: string;
}
