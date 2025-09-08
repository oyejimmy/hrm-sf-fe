export interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: "Annual" | "Sick" | "Casual" | "Compensatory";
  fromDate: string;
  toDate: string;
  duration: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
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
