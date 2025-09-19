import React from 'react';
import { Card, Statistic, Row, Col, Progress, Space } from 'antd';
import { CheckCircle, XCircle, Info, TrendingUp, UserCheck, UserX, AlertCircle, Coffee } from 'lucide-react';
import styled from 'styled-components';

// Replicating the type from the parent component
interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
  attendancePercentage: number;
}

interface AttendanceOverviewPanelProps {
  summary: AttendanceSummary;
  loading: boolean;
}

interface StatItemProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StyledCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
  height: 100%;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const StatsCard = styled(Card)`
  height: 100%;
  
  .ant-card-body {
    padding: 12px;
  }
`;

const OverviewTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 24px;
`;

// StatItem component for individual stats
const StatItem: React.FC<StatItemProps> = ({ title, value, icon, color }) => (
  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
    <StatsCard>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color, fontSize: '18px' }}
        style={{ textAlign: 'center' }}
      />
    </StatsCard>
  </Col>
);

const AttendanceOverviewPanel: React.FC<AttendanceOverviewPanelProps> = ({ summary, loading }) => {
  return (
    <StyledCard loading={loading} title={
      <Space>
        <TrendingUp size={18} />
        Attendance Overview
      </Space>}>
      <Row gutter={[8, 8]}>
        <StatItem
          title="Present"
          value={summary.presentDays || 0}
          icon={<UserCheck size={16} style={{ color: '#52c41a' }} />}
          color="#52c41a"
        />
        <StatItem
          title="Absent"
          value={summary.absentDays || 0}
          icon={<UserX size={16} style={{ color: '#f5222d' }} />}
          color="#f5222d"
        />
        <StatItem
          title="Late"
          value={summary.lateDays || 0}
          icon={<AlertCircle size={16} style={{ color: '#faad14' }} />}
          color="#faad14"
        />
        <StatItem
          title="On Leave"
          value={0} // Mock data since this value is not in the summary prop
          icon={<Coffee size={16} style={{ color: '#1890ff' }} />}
          color="#1890ff"
        />
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Statistic
            title="Attendance Rate"
            value={`${summary.attendancePercentage}%`}
            valueStyle={{ color: '#1a237e', fontSize: '24px' }}
          />
          <Progress
            percent={summary.attendancePercentage}
            status="active"
            strokeColor={{ from: '#388E3C', to: '#1a237e' }}
            showInfo={false}
          />
        </Col>
      </Row>
    </StyledCard>
  );
};

export default AttendanceOverviewPanel;