// AdminDashboard/index.tsx
import React from "react";
import TopStats from "./components/TopStats";
import QuickActions, { ActionItem } from "./components/QuickActions";
import RecentActivities from "./components/RecentActivities";
import Announcements from "./components/Announcements";
import DepartmentOverview from "./components/DepartmentOverview";
import TrainingSummary from "./components/TrainingSummary";
import PerformanceSnapshot from "./components/PerformanceSnapshot";
import RecruitmentPipeline from "./components/RecruitmentPipeline";
import AttendanceTrends from "./components/AttendanceTrends";
import type {
  TopStat,
  Activity,
  Announcement,
  DepartmentOverview as Dept,
  TrainingSummaryItem,
  PerformanceSnapshotItem,
  RecruitmentPipelineItem,
  AttendanceTrendPoint,
  Role,
} from "./types";
import { PlusOutlined, TeamOutlined, FileTextOutlined, BarChartOutlined } from "@ant-design/icons";
import { PageContainer } from "./components/styles";

/** Mock / example data — replace with API calls in real app */
const mockTopStats: TopStat[] = [
  { id: "s1", title: "Total Employees", value: 1250, color: "#1890ff", icon: <PlusOutlined /> },
  { id: "s2", title: "Active Today", value: 1180, color: "#52c41a" },
  { id: "s3", title: "On Leave", value: 45, color: "#faad14" },
  { id: "s4", title: "Avg Performance", value: "87.5", suffix: "%", color: "#722ed1" },
];

const mockActions: ActionItem[] = [
  { id: "a1", title: "Add Employee", icon: <PlusOutlined />, roles: ["HR_ADMIN", "PMO"] as Role[] },
  { id: "a2", title: "Schedule Interview", icon: <TeamOutlined />, roles: ["HR_ADMIN"] as Role[] },
  { id: "a3", title: "Create Training", icon: <FileTextOutlined />, roles: ["HR_ADMIN", "PMO"] as Role[] },
  { id: "a4", title: "Generate Report", icon: <BarChartOutlined />, roles: ["HR_ADMIN", "FINANCE"] as Role[] },
];

const mockActivities: Activity[] = [
  { id: "act1", activity: "John Doe requested annual leave", time: "2 hours ago", status: "Pending" },
  { id: "act2", activity: "Sarah completed training", time: "4 hours ago", status: "Completed" },
  { id: "act3", activity: "Mike logged attendance", time: "6 hours ago", status: "Present" },
];

const mockAnnouncements: Announcement[] = [
  { id: "ann1", title: "Company Meeting", body: "All-hands scheduled Friday 2 PM.", postedAt: "2 days ago", author: "CEO" },
  { id: "ann2", title: "Policy Update", body: "Remote work policy revised.", postedAt: "1 week ago", author: "HR" },
];

const mockDepartments: Dept[] = [
  { id: "d1", name: "Engineering", employees: 400, avgPerformance: 92 },
  { id: "d2", name: "Sales", employees: 250, avgPerformance: 81 },
  { id: "d3", name: "HR", employees: 50, avgPerformance: 88 },
  { id: "d4", name: "Finance", employees: 80, avgPerformance: 85 },
];

const mockTraining: TrainingSummaryItem[] = [
  { id: "t1", track: "Frontend", assigned: 40, completed: 24, avgProgress: 60 },
  { id: "t2", track: "DevOps", assigned: 30, completed: 10, avgProgress: 35 },
];

const mockPerformance: PerformanceSnapshotItem[] = [
  { id: "p1", cycle: "Q1 2025", avgScore: 78, completedCount: 120 },
  { id: "p2", cycle: "Q2 2025", avgScore: 82, completedCount: 130 },
];

const mockPipeline: RecruitmentPipelineItem[] = [
  { id: "r1", stage: "Applied", count: 120 },
  { id: "r2", stage: "Interviewing", count: 32 },
  { id: "r3", stage: "Offered", count: 8 },
];

const mockAttendance: AttendanceTrendPoint[] = [
  { date: "2025-09-01", present: 1100, absent: 50 },
  { date: "2025-09-02", present: 1120, absent: 30 },
];

interface Props {
  role?: Role; // current user role, used for role-based visibility
}

/** Main Admin Dashboard component */
const AdminDashboard: React.FC<Props> = ({ role = "HR_ADMIN" }) => {
  return (
    <PageContainer>
      <h2 style={{ marginBottom: 16 }}>HRM Admin Dashboard</h2>

      {/* Top stats */}
      <TopStats stats={mockTopStats} />

      {/* Quick actions + Recent activities */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16, marginBottom: 16 }}>
        <QuickActions actions={mockActions} role={role} />
        <RecentActivities activities={mockActivities} />
      </div>

      {/* Announcements */}
      <Announcements announcements={mockAnnouncements} />

      {/* Department overview + training + performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginTop: 16 }}>
        <div>
          {/* Departments */}
          <DepartmentOverview departments={mockDepartments} />
          {/* Recruitment pipeline */}
          <RecruitmentPipeline pipeline={mockPipeline} />
          {/* Attendance */}
          <AttendanceTrends trends={mockAttendance} />
        </div>

        <div>
          <TrainingSummary summaries={mockTraining} />
          <PerformanceSnapshot items={mockPerformance} />
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
