// LeaveManagement types

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type LeaveType = "Annual" | "Sick" | "Casual" | "Comp Off" | "Maternity" | "Paternity" | "Unpaid";

export interface LeaveBalance {
  type: LeaveType;
  taken: number;
  remaining: number;
  totalAllocated?: number;
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  from: string; // ISO date
  to: string;   // ISO date
  duration: number; // days (can be 0.5)
  durationType: "Full Day" | "Half Day" | "Hourly";
  hours?: number; // when hourly
  reason?: string;
  attachmentUrl?: string;
  approver?: string;
  status: LeaveStatus;
  appliedAt: string; // ISO
  comments?: string;
}

export interface LeaveCalendarEvent {
  id: string;
  date: string; // ISO date (single-day event) or start/end handled client-side
  type: LeaveType;
  status: LeaveStatus;
  note?: string;
}

export interface LeaveNotification {
  id: string;
  message: string;
  date: string; // friendly string
  read?: boolean;
  level?: "info" | "warning" | "critical";
}
export interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
  compensatory: number;
  totalTaken: number;
}


export interface LeavePolicy {
  type: string;
  eligibility: string;
  workflow: string;
  documentation?: string;
}