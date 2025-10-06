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
        <Col xs={24} sm={12} lg={8}>
          <StateCard
            loading={loading}
            label="Pending Requests"
            value={stats.pendingRequests}
            icon={<Clock />}
            tone="lightPeach"
            description="Awaiting approval"
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StateCard
            loading={loading}
            label="Approved This Month"
            value={stats.approvedThisMonth}
            icon={<CheckCircle />}
            tone="pastelGreen"
            description="Successfully approved"
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StateCard
            loading={loading}
            label="Rejected This Month"
            value={stats.rejectedThisMonth}
            icon={<XCircle />}
            tone="pastelPink"
            description="Declined requests"
          />
        </Col>


        
        {!screens.xs && (
          <>
            <Col xs={24} lg={24}>
              <StatCard title="Quick Insights" loading={loading}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {stats.pendingRequests > 5 && (
                    <Space>
                      <AlertTriangle size={16} color="#faad14" />
                      <Text type="warning">
                        High number of pending requests ({stats.pendingRequests})
                      </Text>
                    </Space>
                  )}
                  {approvalRate > 90 && (
                    <Space>
                      <TrendingUp size={16} color="#52c41a" />
                      <Text type="success">
                        Excellent approval rate ({Math.round(approvalRate)}%)
                      </Text>
                    </Space>
                  )}
                  {stats.onLeaveToday > 0 && (
                    <Space>
                      <Calendar size={16} color="#1890ff" />
                      <Text>
                        {stats.onLeaveToday} employee
                        {stats.onLeaveToday !== 1 ? "s" : ""} on leave today
                      </Text>
                    </Space>
                  )}
                  {totalRequests === 0 && (
                    <Space>
                      <CheckCircle size={16} color="#52c41a" />
                      <Text type="secondary">No leave requests this month</Text>
                    </Space>
                  )}
                  <div style={{ 
                    padding: '8px 0', 
                    borderTop: `1px solid ${isDarkMode ? 'var(--border)' : '#f0f0f0'}`,
                    marginTop: '8px'
                  }}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Total Requests:</Text>
                        <Text strong style={{ fontSize: '12px' }}>{totalRequests}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Avg. Processing:</Text>
                        <Text strong style={{ fontSize: '12px' }}>2.3 days</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Most Common:</Text>
                        <Text strong style={{ fontSize: '12px' }}>Annual Leave</Text>
                      </div>
                    </Space>
                  </div>
                </Space>
              </StatCard>
            </Col>
          </>
        )}
      </Row>
    </Spin>
  );
};

export default LeaveDashboardStats;