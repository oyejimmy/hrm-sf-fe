import React, { useState } from "react";
import { Space } from "antd";
import LeaveApprovalTable from "./components/LeaveApprovalTable";
import TeamLeaveSummary from "./components/TeamLeaveSummary";
import LeaveAnalytics from "./components/LeaveAnalytics";
import LeavePolicyAdmin from "./components/LeavePolicyAdmin";
import LeaveReports from "./components/LeaveReports";
import Notifications from "./components/Notifications";
import { LeaveRequest, TeamLeaveSummary as Summary, LeaveAnalyticsData, LeaveReport } from "./types";

const AdminLeaveManagementPage: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employee: "Ali Khan",
      department: "Engineering",
      type: "Annual",
      fromDate: "2025-09-15",
      toDate: "2025-09-20",
      duration: "5 days",
      reason: "Family trip",
      status: "Pending",
    },
    {
      id: "2",
      employee: "Sara Ahmed",
      department: "HR",
      type: "Sick",
      fromDate: "2025-09-08",
      toDate: "2025-09-09",
      duration: "2 days",
      reason: "Flu",
      status: "Approved",
    },
  ]);

  const summaries: Summary[] = [
    { department: "Engineering", totalEmployees: 25, onLeave: 3, pending: 2, approved: 5, rejected: 1 },
    { department: "HR", totalEmployees: 10, onLeave: 1, pending: 1, approved: 2, rejected: 0 },
  ];

  const analytics = {
    annual: 12,
    sick: 8,
    casual: 5,
    compensatory: 3,
  };

  const reports: LeaveReport[] = [
    { id: "r1", title: "Monthly Leave Report - August", generatedAt: "2025-09-01", url: "/reports/august.pdf" },
    { id: "r2", title: "Quarterly Leave Report - Q2", generatedAt: "2025-07-01", url: "/reports/q2.pdf" },
  ];

  const policies: any = [
    { type: "Annual Leave", eligibility: "Available after 6 months", workflow: "Request → Lead → HR → Approval" },
    { type: "Sick Leave", eligibility: "Available anytime", workflow: "Request → Lead → HR", documentation: "Medical certificate required if more than 2 days" },
  ];

  const notifications = [
    { id: "1", message: "3 pending leave requests require your action.", type: "warning" as const },
    { id: "2", message: "Monthly leave report is ready.", type: "info" as const },
  ];

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
  };

  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <TeamLeaveSummary summaries={summaries} />
      <LeaveApprovalTable
        requests={leaveRequests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <LeaveAnalytics balances={analytics} />
      <LeavePolicyAdmin policies={policies} onEdit={(p) => console.log("Edit policy", p)} />
      <LeaveReports reports={reports} />
      <Notifications notifications={notifications} />
    </Space>
  );
};

export default AdminLeaveManagementPage;
