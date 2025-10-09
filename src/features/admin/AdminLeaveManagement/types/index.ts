export interface LeaveRequest {
  id: number;
  employee_id: number;
  employeeId: string;
  employeeName: string;
  department?: string;
  position?: string;
  leave_type: string;
  leaveType: string;
  start_date: string;
  startDate: string;
  end_date: string;
  endDate: string;
  days_requested: number;
  reason: string;
  status: string;
  created_at: string;
  createdAt: string;
  approved_by?: number;
  approvedBy?: string;
  approved_at?: string;
  approvedAt?: string;
  rejection_reason?: string;
  rejectionReason?: string;
  approverComments?: string;
  updatedAt?: string;
  totalAllocated?: number;
  usedDays?: number;
  remainingBalance?: number;
}

export interface LeaveStats {
  pendingRequests: number;
  approvedThisMonth: number;
  rejectedRequests: number;
  totalRequests: number;
}

export interface AllLeavesTableProps {
  onViewDetails: (leave: LeaveRequest) => void;
  onApprove: (leave: LeaveRequest) => void;
  onReject: (leave: LeaveRequest) => void;
}

export interface StatusIndicatorProps {
  isOnline: boolean;
  lastUpdate: Date;
  isLoading?: boolean;
}