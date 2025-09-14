export interface PendingApproval {
  name: string;
  department: string;
  time: string;
}

export interface Announcement {
  title: string;
  content: string;
}

export interface Holiday {
  name: string;
  date: string;
}

export interface Activity {
  action: string;
  time: string;
}

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
}