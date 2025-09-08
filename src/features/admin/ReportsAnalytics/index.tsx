import React from "react";
import DashboardCards from "./components/DashboardCards";
import AnalyticsCharts from "./components/AnalyticsCharts";
import ReportsTable from "./components/ReportsTable";
import { DashboardStat, ChartData, Report } from "./types";
import { GridContainer } from "./components/styles";

const ReportsAnalytics: React.FC = () => {
  // ✅ Dummy data
  const stats: DashboardStat[] = [
    { title: "Total Employees", value: 120 },
    { title: "Active Employees", value: 100 },
    { title: "Inactive Employees", value: 20 },
    { title: "Avg. Performance Score", value: 85, suffix: "%" },
  ];

  const employeeChart: ChartData = {
    categories: ["HR", "IT", "Finance", "Marketing"],
    series: [{ name: "Employees", data: [20, 50, 25, 25] }],
  };

  const recruitmentChart: ChartData = {
    categories: ["Jan", "Feb", "Mar", "Apr", "May"],
    series: [
      { name: "Hired", data: [5, 10, 8, 12, 7] },
      { name: "Attrition", data: [2, 3, 4, 1, 5] },
    ],
  };

  const reports: Report[] = [
    {
      id: "1",
      name: "August Attendance Summary",
      type: "Attendance",
      createdBy: "Admin",
      createdOn: "2025-08-01",
      status: "Finalized",
    },
    {
      id: "2",
      name: "Quarterly Recruitment Report",
      type: "Recruitment",
      createdBy: "HR Manager",
      createdOn: "2025-07-20",
      status: "Shared",
    },
  ];

  return (
    <div>
      {/* Dashboard Summary */}
      <DashboardCards stats={stats} />

      {/* Analytics Sections */}
      <GridContainer>
        <AnalyticsCharts title="Department-wise Headcount" type="bar" data={employeeChart} />
        <AnalyticsCharts title="Hiring vs Attrition Trends" type="line" data={recruitmentChart} />
      </GridContainer>

      {/* Reports Table */}
      <ReportsTable
        reports={reports}
        onView={(r) => console.log("View", r)}
        onDownload={(r) => console.log("Download", r)}
        onDelete={(r) => console.log("Delete", r)}
      />
    </div>
  );
};

export default ReportsAnalytics;
