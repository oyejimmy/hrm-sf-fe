import React from 'react';
import styled from 'styled-components';
import { Card, Progress, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body {
    padding: 24px;
  }
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  text-align: center;
`;

const MetricLabel = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
`;

const MetricValue = styled(Title)`
  && {
    margin: 0;
    font-size: 28px;
    line-height: 1;
  }
`;

interface Props {
  monthlyPercent?: number;
  lateCount?: number;
  overtimeHours?: number;
}

const AttendanceAnalytics: React.FC<Props> = ({
  monthlyPercent = 92,
  lateCount = 3,
  overtimeHours = 6,
}) => {
  return (
    <Wrapper title="Attendance Analytics" bordered={false}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={8}>
          <MetricCard>
            <MetricLabel>Monthly Attendance</MetricLabel>
            <Progress type="circle" percent={monthlyPercent} width={80} />
          </MetricCard>
        </Col>

        <Col xs={12} sm={8}>
          <MetricCard>
            <MetricLabel>Late Arrivals</MetricLabel>
            <MetricValue level={2}>{lateCount}</MetricValue>
          </MetricCard>
        </Col>

        <Col xs={12} sm={8}>
          <MetricCard>
            <MetricLabel>Overtime Hours</MetricLabel>
            <MetricValue level={2}>{overtimeHours}h</MetricValue>
          </MetricCard>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default AttendanceAnalytics;
