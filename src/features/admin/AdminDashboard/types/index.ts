// AdminDashboard/types/index.ts

export type Role = "HR_ADMIN" | "TEAM_LEAD" | "FINANCE" | "PMO" | "EMPLOYEE";

export interface TopStat {
  id: string;
  title: string;
  value: number | string;
  suffix?: string;
  color?: string;
  icon?: React.ReactNode;
}

export interface Activity {
  id: string;
  activity: string;
  time: string; // friendly text like "2 hours ago"
  status: "Pending" | "Completed" | "Present" | "Submitted" | "Failed";
  meta?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  author?: string;
}

export interface DepartmentOverview {
  id: string;
  name: string;
  employees: number;
  avgPerformance: number; // 0-100
}

export interface TrainingSummaryItem {
  id: string;
  track: string;
  assigned: number;
  completed: number; // count
  avgProgress: number; // percent
}

export interface PerformanceSnapshotItem {
  id: string;
  cycle: string;
  avgScore: number; // 0-100
  completedCount: number;
}

export interface RecruitmentPipelineItem {
  id: string;
  stage: string;
  count: number;
}

export interface AttendanceTrendPoint {
  date: string; // ISO or human
  present: number;
  absent: number;
}
