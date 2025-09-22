import React from "react";
import { Row, Col, Statistic, Progress, Space, Typography } from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { StatCard, StatisticWrapper, IconWrapper } from "./styles";
import { DashboardStats } from "../types";
import { StateCard } from "../../../../components/StateCard";

const { Text } = Typography;

// Define props interface for LeaveDashboardStats component
interface LeaveDashboardStatsProps {
  stats: DashboardStats; // Dashboard statistics data
  loading?: boolean; // Loading state for the component
}

// LeaveDashboardStats functional component
const LeaveDashboardStats: React.FC<LeaveDashboardStatsProps> = ({
  stats,
  loading = false,
}) => {
  // Calculate total leave requests
  const totalRequests =
    stats.pendingRequests + stats.approvedThisMonth + stats.rejectedThisMonth;
  // Calculate approval rate, handling division by zero
  const approvalRate =
    totalRequests > 0 ? (stats.approvedThisMonth / totalRequests) * 100 : 0;

  return (
    <Row gutter={[16, 16]}>
      {/* Ant Design Row component with gutter spacing */}
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          loading={loading}
          label="Pending Requests"
          value={stats.pendingRequests}
          icon={<Clock />}
          tone="lightPeach"
          description="Awaiting approval"
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          loading={loading}
          label="Approved This Month"
          value={stats.approvedThisMonth}
          icon={<CheckCircle />}
          tone="pastelGreen"
          description="Successfully approved"
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          loading={loading}
          label="Rejected This Month"
          value={stats.rejectedThisMonth}
          icon={<XCircle />}
          tone="pastelPink"
          description="Declined requests"
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          loading={loading}
          label="On Leave Today"
          value={stats.onLeaveToday}
          icon={<Users />}
          tone="pastelBlue"
          description="Currently absent"
        />
      </Col>
      <Col xs={24} lg={12}>
        {" "}
        {/* Column for responsive layout */}
        <StatCard title="Approval Rate This Month" loading={loading}>
          {" "}
          {/* Statistic card for approval rate */}
          <Space direction="vertical" style={{ width: "100%" }}>
            {" "}
            {/* Vertical space for progress bar and details */}
            <Progress
              percent={Math.round(approvalRate)} // Percentage for the progress bar
              strokeColor={{
                // Gradient stroke color for the progress bar
                "0%": "#52c41a",
                "100%": "#73d13d",
              }}
              trailColor="#f0f0f0" // Trail color of the progress bar
              strokeWidth={12} // Width of the progress bar stroke
              format={(percent) => `${percent}%`} // Format of the percentage text
            />
            <Row justify="space-between">
              {" "}
              {/* Row to justify content between */}
              <Col>
                {" "}
                {/* Column for approved count */}
                <Space>
                  <CheckCircle size={16} color="#52c41a" />{" "}
                  {/* CheckCircle icon */}
                  <Text>Approved: {stats.approvedThisMonth}</Text>{" "}
                  {/* Approved count text */}
                </Space>
              </Col>
              <Col>
                {" "}
                {/* Column for rejected count */}
                <Space>
                  <XCircle size={16} color="#ff4d4f" /> {/* XCircle icon */}
                  <Text>Rejected: {stats.rejectedThisMonth}</Text>{" "}
                  {/* Rejected count text */}
                </Space>
              </Col>
            </Row>
          </Space>
        </StatCard>
      </Col>
      <Col xs={24} lg={12}>
        {" "}
        {/* Column for responsive layout */}
        <StatCard title="Quick Insights" loading={loading}>
          {" "}
          {/* Statistic card for quick insights */}
          <Space direction="vertical" style={{ width: "100%" }}>
            {" "}
            {/* Vertical space for insight items */}
            {stats.pendingRequests > 5 && ( // Conditionally render if pending requests are high
              <Space>
                <AlertTriangle size={16} color="#faad14" />{" "}
                {/* AlertTriangle icon */}
                <Text type="warning">
                  High number of pending requests ({stats.pendingRequests})
                </Text>
              </Space>
            )}
            {approvalRate > 90 && ( // Conditionally render if approval rate is excellent
              <Space>
                <TrendingUp size={16} color="#52c41a" /> {/* TrendingUp icon */}
                <Text type="success">
                  Excellent approval rate ({Math.round(approvalRate)}%)
                </Text>
              </Space>
            )}
            {stats.onLeaveToday > 0 && ( // Conditionally render if employees are on leave today
              <Space>
                <Calendar size={16} color="#1890ff" /> {/* Calendar icon */}
                <Text>
                  {stats.onLeaveToday} employee
                  {stats.onLeaveToday !== 1 ? "s" : ""} on leave today
                </Text>
              </Space>
            )}
            {totalRequests === 0 && ( // Conditionally render if no leave requests this month
              <Space>
                <CheckCircle size={16} color="#52c41a" />{" "}
                {/* CheckCircle icon */}
                <Text type="secondary">No leave requests this month</Text>
              </Space>
            )}
          </Space>
        </StatCard>
      </Col>
    </Row>
  );
};

export default LeaveDashboardStats;
