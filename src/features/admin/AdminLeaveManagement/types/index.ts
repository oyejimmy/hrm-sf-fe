export interface LeaveRequest {
  id: string;
  employee: string;
  employeeId?: string;
  department: string;
  type: "Annual" | "Sick" | "Casual" | "Compensatory";
  fromDate: string;
  toDate: string;
  duration: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "On Hold";
  adminComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface TeamLeaveSummary {
  department: string;
  totalEmployees: number;
  onLeave: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface LeaveAnalyticsData {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface LeaveReport {
  id: string;
  title: string;
  generatedAt: string;
  url: string;
}
