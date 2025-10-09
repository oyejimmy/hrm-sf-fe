import React from "react";
import { Row, Col, Statistic, Progress, Space, Typography, Grid, Spin } from "antd";
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
import { useTheme } from "../../../../contexts/ThemeContext";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface LeaveDashboardStatsProps {
  stats: DashboardStats;
  loading?: boolean;
  showTrends?: boolean;
  compactMode?: boolean;
}

const LeaveDashboardStats: React.FC<LeaveDashboardStatsProps> = ({
  stats,
  loading = false,
  showTrends = false,
  compactMode = false
}) => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  // Calculate total leave requests
  const totalRequests =
    stats.pendingRequests + stats.approvedThisMonth + stats.rejectedThisMonth;
  // Calculate approval rate, handling division by zero
  const approvalRate =
    totalRequests > 0 ? (stats.approvedThisMonth / totalRequests) * 100 : 0;

  if (compactMode) {
    return (
      <Spin spinning={loading}>
        <Row gutter={[8, 8]}>
          <Col xs={12} sm={6}>
            <StateCard
              loading={loading}
              label={screens.xs ? "Pending" : "Pending Requests"}
              value={stats.pendingRequests}
              icon={<Clock size={screens.xs ? 16 : 20} />}
              tone="lightPeach"
              description="Awaiting approval"
            />
          </Col>
          <Col xs={12} sm={6}>
            <StateCard
              loading={loading}
              label={screens.xs ? "Approved" : "Approved This Month"}
              value={stats.approvedThisMonth}
              icon={<CheckCircle size={screens.xs ? 16 : 20} />}
              tone="pastelGreen"
              description="Successfully approved"
            />
          </Col>
          <Col xs={12} sm={6}>
            <StateCard
              loading={loading}
              label={screens.xs ? "Rejected" : "Rejected This Month"}
              value={stats.rejectedThisMonth}
              icon={<XCircle size={screens.xs ? 16 : 20} />}
              tone="pastelPink"
              description="Declined requests"
            />
          </Col>

        </Row>
      </Spin>
    );
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
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
            label="Total Requests"
            value={totalRequests}
            icon={<Users />}
            tone="pastelBlue"
            description="All time requests"
          />
        </Col>



      </Row>
    </Spin>
  );
};

export default LeaveDashboardStats;