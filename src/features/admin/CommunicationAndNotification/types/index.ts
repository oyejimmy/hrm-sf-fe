export interface Notification {
  id?: number;
  title: string;
  message: string;
  date: string; // auto-added or user-selected
  priority: "High" | "Medium" | "Low";
}
