import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import { CheckCircle, XCircle, Info, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
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

const OverviewTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 24px;
`;

const AttendanceOverviewPanel: React.FC<AttendanceOverviewPanelProps> = ({ summary, loading }) => {
  return (
    <StyledCard loading={loading}>
      <OverviewTitle>Attendance Overview</OverviewTitle>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} lg={24}>
          <Statistic
            title="Present Days"
            value={summary.presentDays}
            prefix={<CheckCircle color="#388E3C" />}
            valueStyle={{ color: '#388E3C', fontSize: '24px' }}
          />
        </Col>
        <Col xs={12} sm={12} lg={24}>
          <Statistic
            title="Absent Days"
            value={summary.absentDays}
            prefix={<XCircle color="#D32F2F" />}
            valueStyle={{ color: '#D32F2F', fontSize: '24px' }}
          />
        </Col>
        <Col xs={12} sm={12} lg={24}>
          <Statistic
            title="Late Days"
            value={summary.lateDays}
            prefix={<Info color="#F57C00" />}
            valueStyle={{ color: '#F57C00', fontSize: '24px' }}
          />
        </Col>
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