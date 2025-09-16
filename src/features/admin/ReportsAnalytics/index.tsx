import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message, Grid } from "antd";
import DashboardCards from "./components/DashboardCards";
import AnalyticsCharts from "./components/AnalyticsCharts";
import ReportsTable from "./components/ReportsTable";
import { DashboardStat, ChartData, Report } from "./types";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";

const { useBreakpoint } = Grid;

// Mock data functions
const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Total Employees",
          value: 120,
          icon: <TeamOutlined style={{ color: "#1890ff", fontSize: "20px" }} />,
          color: "#1890ff"
        },
        {
          title: "Active Employees",
          value: 100,
          icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "20px" }} />,
          color: "#52c41a"
        },
        {
          title: "Inactive Employees",
          value: 20,
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />,
          color: "#ff4d4f"
        },
        {
          title: "Avg. Performance Score",
          value: 85,
          suffix: "%",
          icon: <BarChartOutlined style={{ color: "#fa8c16", fontSize: "20px" }} />,
          color: "#fa8c16"
        },
      ]);
    }, 500);
  });
};

const fetchEmployeeChartData = async (): Promise<ChartData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: ["HR", "IT", "Finance", "Marketing"],
        series: [{ name: "Employees", data: [20, 50, 25, 25] }]
      });
    }, 600);
  });
};

const fetchRecruitmentChartData = async (): Promise<ChartData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: ["Jan", "Feb", "Mar", "Apr", "May"],
        series: [
          { name: "Hired", data: [5, 10, 8, 12, 7] },
          { name: "Attrition", data: [2, 3, 4, 1, 5] },
        ]
      });
    }, 700);
  });
};

const fetchReports = async (): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
        {
          id: "3",
          name: "Q3 Performance Reviews",
          type: "Performance",
          createdBy: "HR Director",
          createdOn: "2025-09-10",
          status: "Draft",
        },
        {
          id: "4",
          name: "Custom Analytics Report",
          type: "Custom",
          createdBy: "Data Analyst",
          createdOn: "2025-08-15",
          status: "Shared",
        },
      ]);
    }, 800);
  });
};

const deleteReport = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Report ${id} deleted`);
      resolve();
    }, 500);
  });
};

const ReportsAnalytics: React.FC = () => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const queryClient = useQueryClient();

  // API URLs (commented out for future implementation)
  // const DASHBOARD_STATS_URL = "/api/dashboard/stats";
  // const EMPLOYEE_CHART_URL = "/api/charts/employees";
  // const RECRUITMENT_CHART_URL = "/api/charts/recruitment";
  // const REPORTS_URL = "/api/reports";

  // TanStack Query hooks
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    // queryFn: () => fetch(DASHBOARD_STATS_URL).then(res => res.json()),
  });

  const { data: employeeChart, isLoading: employeeChartLoading } = useQuery({
    queryKey: ['employeeChart'],
    queryFn: fetchEmployeeChartData,
    // queryFn: () => fetch(EMPLOYEE_CHART_URL).then(res => res.json()),
  });

  const { data: recruitmentChart, isLoading: recruitmentChartLoading } = useQuery({
    queryKey: ['recruitmentChart'],
    queryFn: fetchRecruitmentChartData,
    // queryFn: () => fetch(RECRUITMENT_CHART_URL).then(res => res.json()),
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
    // queryFn: () => fetch(REPORTS_URL).then(res => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      message.success('Report deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete report');
    }
  });

  const handleView = (report: Report) => {
    console.log("View", report);
    message.info(`Viewing report: ${report.name}`);
  };

  const handleDownload = (report: Report) => {
    console.log("Download", report);
    message.success(`Downloading report: ${report.name}`);
  };

  const handleDelete = (report: Report) => {
    console.log("Delete", report);
    deleteMutation.mutate(report.id);
  };

  // Responsive layout
  const chartLayout = screens.xs ? { span: 24 } : { span: 12 };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Reports Management"
        subtitle="Manage Reports  "
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]} />
      <div>
        {/* Dashboard Summary */}
        {stats && <DashboardCards stats={stats} />}

        {/* Analytics Sections */}
        <div style={{
          display: 'flex',
          flexDirection: screens.xs ? 'column' : 'row',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ flex: 1 }}>
            {employeeChart && (
              <AnalyticsCharts
                title="Department-wise Headcount"
                type="bar"
                data={employeeChart}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {recruitmentChart && (
              <AnalyticsCharts
                title="Hiring vs Attrition Trends"
                type="line"
                data={recruitmentChart}
              />
            )}
          </div>
        </div>

        {/* Reports Table */}
        {reports && (
          <ReportsTable
            reports={reports}
            onView={handleView}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        )}
      </div>

    </Wrapper>
  );
};

export default ReportsAnalytics;