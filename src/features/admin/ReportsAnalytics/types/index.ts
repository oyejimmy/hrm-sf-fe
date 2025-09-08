// Types for Reports & Analytics

export interface Report {
  id: string;
  name: string;
  type: "Performance" | "Recruitment" | "Attendance" | "Custom";
  createdBy: string;
  createdOn: string;
  status: "Draft" | "Finalized" | "Shared";
}

export interface DashboardStat {
  title: string;
  value: number | string;
  suffix?: string;
}

export interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}
