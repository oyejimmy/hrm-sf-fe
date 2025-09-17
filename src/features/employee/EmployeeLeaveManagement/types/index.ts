export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "On Hold" | "Cancelled";
export type LeaveType = "Annual" | "Sick" | "Casual" | "Half Day" | "Comp Off" | "Maternity" | "Paternity" | "Unpaid";
export type DurationType = "Full Day" | "Half Day - Morning" | "Half Day - Afternoon";
export type ApprovalAction = "approve" | "reject" | "hold" | "request_details";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
}

export interface LeaveBalance {
  type: LeaveType;
  taken: number;
  remaining: number;
  totalAllocated: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  type: LeaveType;
  from: string;
  to: string;
  duration: number;
  durationType: DurationType;
  reason: string;
  attachmentUrl?: string;
  recipients: string[]; // Employee IDs who will receive notifications
  recipientDetails: Employee[];
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  comments?: string;
  adminComments?: string;
}

export interface LeaveApprovalRequest {
  requestId: string;
  action: ApprovalAction;
  comments?: string;
  additionalDetailsRequired?: string;
}

export interface LeaveNotification {
  id: string;
  type: 'leave_request' | 'leave_approved' | 'leave_rejected' | 'leave_on_hold' | 'details_requested';
  message: string;
  leaveRequestId: string;
  fromEmployee: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  pendingRequests: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  onLeaveToday: number;
}

export interface LeavePolicy {
  type: string;
  eligibility: string;
  workflow: string;
  documentation?: string;
}