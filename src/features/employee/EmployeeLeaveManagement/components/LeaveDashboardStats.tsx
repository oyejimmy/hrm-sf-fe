import React from 'react';
import { Card, Row, Col, Statistic, Progress, Space, Typography } from 'antd';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import styled from 'styled-components';
import { DashboardStats } from '../types';

const { Text } = Typography;

const StatCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  color: ${props => props.$color};
  margin-bottom: 12px;
`;

const StatisticWrapper = styled.div`
  text-align: center;
`;

interface LeaveDashboardStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const LeaveDashboardStats: React.FC<LeaveDashboardStatsProps> = ({
  stats,
  loading = false
}) => {
  const totalRequests = stats.pendingRequests + stats.approvedThisMonth + stats.rejectedThisMonth;
  const approvalRate = totalRequests > 0 ? (stats.approvedThisMonth / totalRequests) * 100 : 0;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard loading={loading}>
          <StatisticWrapper>
            <IconWrapper $color="#faad14">
              <Clock size={24} />
            </IconWrapper>
            <Statistic
              title="Pending Requests"
              value={stats.pendingRequests}
              valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Awaiting approval
            </Text>
          </StatisticWrapper>
        </StatCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard loading={loading}>
          <StatisticWrapper>
            <IconWrapper $color="#52c41a">
              <CheckCircle size={24} />
            </IconWrapper>
            <Statistic
              title="Approved This Month"
              value={stats.approvedThisMonth}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Successfully approved
            </Text>
          </StatisticWrapper>
        </StatCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard loading={loading}>
          <StatisticWrapper>
            <IconWrapper $color="#ff4d4f">
              <XCircle size={24} />
            </IconWrapper>
            <Statistic
              title="Rejected This Month"
              value={stats.rejectedThisMonth}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Declined requests
            </Text>
          </StatisticWrapper>
        </StatCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard loading={loading}>
          <StatisticWrapper>
            <IconWrapper $color="#1890ff">
              <Users size={24} />
            </IconWrapper>
            <Statistic
              title="On Leave Today"
              value={stats.onLeaveToday}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Currently absent
            </Text>
          </StatisticWrapper>
        </StatCard>
      </Col>

      <Col xs={24} lg={12}>
        <StatCard title="Approval Rate This Month" loading={loading}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Progress
              percent={Math.round(approvalRate)}
              strokeColor={{
                '0%': '#52c41a',
                '100%': '#73d13d',
              }}
              trailColor="#f0f0f0"
              strokeWidth={12}
              format={percent => `${percent}%`}
            />
            <Row justify="space-between">
              <Col>
                <Space>
                  <CheckCircle size={16} color="#52c41a" />
                  <Text>Approved: {stats.approvedThisMonth}</Text>
                </Space>
              </Col>
              <Col>
                <Space>
                  <XCircle size={16} color="#ff4d4f" />
                  <Text>Rejected: {stats.rejectedThisMonth}</Text>
                </Space>
              </Col>
            </Row>
          </Space>
        </StatCard>
      </Col>

      <Col xs={24} lg={12}>
        <StatCard title="Quick Insights" loading={loading}>
          <Space direction="vertical" style={{ width: '100%' }}>
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
                  {stats.onLeaveToday} employee{stats.onLeaveToday !== 1 ? 's' : ''} on leave today
                </Text>
              </Space>
            )}
            
            {totalRequests === 0 && (
              <Space>
                <CheckCircle size={16} color="#52c41a" />
                <Text type="secondary">
                  No leave requests this month
                </Text>
              </Space>
            )}
          </Space>
        </StatCard>
      </Col>
    </Row>
  );
};

export default LeaveDashboardStats;