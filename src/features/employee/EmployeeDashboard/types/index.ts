export interface EmployeeProfile {
  name: string;
  designation: string;
  department: string;
  avatarUrl: string;
}

export interface StatCard {
  id: string;
  title: string;
  value: number;
  suffix?: string;
  color: string;
  icon?: React.ReactNode;
}

export interface ScheduleEvent {
  id: string;
  date: string;
  title: string;
  type: string;
}

export interface TrainingModule {
  id: string;
  name: string;
  progress: number;
}

export interface Activity {
  id: string;
  action: string;
  date: string;
  time: any;
  status: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
}

export interface TrainingProgram {
  id: string;
  course: string;
  category: string;
  instructor: string;
  duration: string;
  enrollment: string;
  status: string;
  action: string;
}