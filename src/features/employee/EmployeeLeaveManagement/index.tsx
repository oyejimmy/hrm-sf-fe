import React, { useState } from "react";
import { Button, Space } from "antd";
import LeaveSummaryPanel from "./components/LeaveSummaryPanel";
import LeaveRequestModal from "./components/LeaveRequestModal";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveHistoryTable from "./components/LeaveHistoryTable";
import PolicyGuidelines from "./components/PolicyGuidelines";
import Notifications from "./components/LeaveNotifications";
import { LeaveBalance, LeaveRequest, LeavePolicy } from "./types";

const LeaveManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leaveBalance: any = {
    annual: 12,
    sick: 5,
    casual: 7,
    compensatory: 2,
    totalTaken: 8,
  };

  const leaveHistory: any = [
    {
      id: "1",
      type: "Annual",
      fromDate: "2025-01-10",
      toDate: "2025-01-12",
      duration: "3 days",
      reason: "Family event",
      status: "Approved",
      approver: "HR Manager",
    },
    {
      id: "2",
      type: "Sick",
      fromDate: "2025-02-03",
      toDate: "2025-02-04",
      duration: "2 days",
      reason: "Fever",
      status: "Pending",
      approver: "Team Lead",
    },
  ];

  const policies: LeavePolicy[] = [
    {
      type: "Annual Leave",
      eligibility: "Available after 6 months of service",
      workflow: "Request → Team Lead → HR → Approval",
    },
    {
      type: "Sick Leave",
      eligibility: "Available anytime",
      workflow: "Request → Team Lead → HR",
      documentation: "Medical certificate if more than 2 days",
    },
  ];

  const notifications = [
    { id: "1", message: "Your leave request has been approved.", type: "success" as const },
    { id: "2", message: "Reminder: You have 5 sick leaves remaining.", type: "info" as const },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <LeaveSummaryPanel balance={leaveBalance} />

      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Request Leave
      </Button>
      <LeaveRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => console.log("Leave request submitted:", data)}
      />

      <LeaveCalendar />

      <LeaveHistoryTable data={leaveHistory} />

      <PolicyGuidelines policies={policies} />

      <Notifications notifications={notifications} />
    </Space>
  );
};

export default LeaveManagementPage;
