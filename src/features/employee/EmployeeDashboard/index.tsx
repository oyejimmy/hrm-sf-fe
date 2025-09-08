import React from "react";
import { PageContainer } from "./components/styles";
import WelcomeHeader from "./components/WelcomeHeader";
import MyStatsOverview from "./components/MyStatsOverview";
import MySchedule from "./components/MySchedule";
import TrainingRoadmap from "./components/TrainingRoadmap";
import RecentActivities from "./components/RecentActivities";
import Announcements from "./components/Announcements";
import QuickActions from "./components/QuickActions";
import type {
  EmployeeProfile,
  StatCard,
  ScheduleEvent,
  TrainingModule,
  Activity,
  Announcement,
  QuickAction,
} from "./types";
import { CalendarOutlined, FileTextOutlined, ProfileOutlined } from "@ant-design/icons";

// Mock Data
const profile: EmployeeProfile = {
  name: "Jamil",
  designation: "Software Engineer",
  department: "Frontend Development",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
};

const stats: StatCard[] = [
  { id: "s1", title: "Attendance", value: 96, suffix: "%", color: "#52c41a" },
  { id: "s2", title: "Leaves Taken", value: 2, color: "#faad14" },
  { id: "s3", title: "Pending Trainings", value: 1, color: "#1890ff" },
  { id: "s4", title: "Projects Assigned", value: 3, color: "#722ed1" },
];

const events: ScheduleEvent[] = [
  { id: "e1", date: "2025-09-10", title: "Team Meeting", type: "Meeting" },
  { id: "e2", date: "2025-09-15", title: "React Training", type: "Training" },
];

const trainings: TrainingModule[] = [
  { id: "t1", name: "Advanced React", progress: 60 },
  { id: "t2", name: "Docker Basics", progress: 30 },
];

const activities: Activity[] = [
  { id: "a1", action: "Submitted leave request", date: "2025-09-01", status: "Completed" },
  { id: "a2", action: "Uploaded project docs", date: "2025-09-02", status: "In Progress" },
];

const announcements: Announcement[] = [
  { id: "an1", title: "Policy Update", description: "New WFH policy effective Sept 15.", date: "2025-09-05", type: "Policy" },
  { id: "an2", title: "Team Outing", description: "Outdoor event planned for Sept 20.", date: "2025-09-06", type: "Event" },
];

const quickActions: QuickAction[] = [
  { id: "q1", label: "Apply Leave", icon: <CalendarOutlined />, onClick: () => alert("Leave request") },
  { id: "q2", label: "View Payslip", icon: <FileTextOutlined />, onClick: () => alert("Payslip view") },
  { id: "q3", label: "Update Profile", icon: <ProfileOutlined />, onClick: () => alert("Profile update") },
];

const EmployeeDashboard: React.FC = () => {
  return (
    <PageContainer>
      <WelcomeHeader profile={profile} />
      <MyStatsOverview stats={stats} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <MySchedule events={events} />
        <TrainingRoadmap trainings={trainings} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RecentActivities activities={activities} />
        <Announcements announcements={announcements} />
      </div>

      <QuickActions actions={quickActions} />
    </PageContainer>
  );
};

export default EmployeeDashboard;
