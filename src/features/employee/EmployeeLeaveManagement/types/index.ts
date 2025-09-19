export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  type: LeaveType;
  durationType: DurationType;
  from: string;
  to: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  recipientDetails: Recipient[];
  adminComments?: string;
  attachmentUrl?: string;
}

export interface Recipient {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  avatar: string;
}

export interface LeaveNotification {
  id: string;
  type: NotificationType;
  message: string;
  fromEmployee: string;
  timestamp: string;
  read: boolean;
  priority: PriorityType;
  leaveRequestId?: string;
}

export interface DashboardStats {
  pendingRequests: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  onLeaveToday: number;
}

export interface LeaveBalance {
  type: string;
  totalAllocated: number;
  taken: number;
  remaining: number;
}

export interface LeavePolicy {
  type: string;
  eligibility: string;
  workflow: string;
  documentation?: string;
}

export interface LeaveApprovalRequest {
  requestId: string;
  action: ApprovalAction;
  comments: string;
  additionalDetailsRequired?: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Paternity' | 'Unpaid';
export type DurationType = 'Full Day' | 'Half Day - Morning' | 'Half Day - Afternoon';
export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected' | 'On Hold';
export type ApprovalAction = 'approve' | 'reject' | 'hold' | 'request_details';
export type NotificationType = 'leave_request' | 'leave_approved' | 'leave_rejected' | 'leave_on_hold' | 'details_requested';
export type PriorityType = 'high' | 'medium' | 'low';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
}