// EmployeeDashboard/types/index.ts

export interface EmployeeProfile {
  name: string;
  designation: string;
  department: string;
  avatarUrl: string;
}

export interface StatCard {
  id: string;
  title: string;
  value: number | string;
  suffix?: string;
  color?: string;
  icon?: React.ReactNode;
}

export interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  type: "Meeting" | "Training" | "Deadline" | "Event";
}

export interface TrainingModule {
  id: string;
  name: string;
  progress: number; // %
}

export interface Activity {
  id: string;
  action: string;
  date: string;
  status: "Completed" | "Pending" | "In Progress";
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "General" | "Policy" | "Event";
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}
