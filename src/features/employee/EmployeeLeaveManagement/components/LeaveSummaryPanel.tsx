import React from 'react';
import { Card, Progress, Space, Typography, Row, Col } from 'antd';
import { Sun, Thermometer, Briefcase, Clock } from 'lucide-react';
import styled from 'styled-components';
import { LeaveBalance } from '../types';

const { Text } = Typography;

const BalanceCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  margin-bottom: 12px;
`;

const IconWrapper = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => `${props.$color}15`};
  color: ${props => props.$color};
  margin-right: 16px;
`;

const BalanceInfo = styled.div`
  flex: 1;
`;

interface LeaveSummaryPanelProps {
  leaveBalances: LeaveBalance[];
}

const LeaveSummaryPanel: React.FC<LeaveSummaryPanelProps> = ({ leaveBalances }) => {
  const getLeaveIcon = (type: string) => {
    switch (type) {
      case 'Annual': return <Sun size={20} />;
      case 'Sick': return <Thermometer size={20} />;
      case 'Casual': return <Briefcase size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Annual': return '#faad14';
      case 'Sick': return '#f5222d';
      case 'Casual': return '#52c41a';
      default: return '#1890ff';
    }
  };

  return (
    <Card title="Leave Balance Summary">
      <Row gutter={[16, 16]}>
        {leaveBalances.map((balance: LeaveBalance, index: number) => {
          const usagePercent = (balance.taken / balance.totalAllocated) * 100;
          const remainingPercent = (balance.remaining / balance.totalAllocated) * 100;
          
          return (
            <Col xs={24} sm={12} lg={8} key={index}>
              <BalanceCard>
                <IconWrapper $color={getLeaveColor(balance.type)}>
                  {getLeaveIcon(balance.type)}
                </IconWrapper>
                <BalanceInfo>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>
                    {balance.type} Leave
                  </Text>
                  <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {balance.remaining} of {balance.totalAllocated} remaining
                  </Text>
                  <Progress
                    percent={usagePercent}
                    success={{ percent: remainingPercent }}
                    strokeColor={getLeaveColor(balance.type)}
                    size="small"
                    style={{ marginTop: 8 }}
                    format={() => `${balance.taken}/${balance.totalAllocated}`}
                  />
                </BalanceInfo>
              </BalanceCard>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default LeaveSummaryPanel;