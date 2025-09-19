import React from 'react';
import { Card, Progress, Space, Typography, Row, Col } from 'antd';
import { Sun, Thermometer, Briefcase, Clock, Baby, UserX } from 'lucide-react';

import {
  BalanceCard,
  IconWrapper,
  BalanceInfo
} from './styles';
import { LeaveBalance } from '../types';

const { Text } = Typography;

interface LeaveSummaryPanelProps {
  leaveBalances: LeaveBalance[];
}

const LeaveSummaryPanel: React.FC<LeaveSummaryPanelProps> = ({ leaveBalances }) => {
  const getLeaveIcon = (type: string) => {
    switch (type) {
      case 'Annual': return <Sun size={20} />;
      case 'Sick': return <Thermometer size={20} />;
      case 'Casual': return <Briefcase size={20} />;
      case 'Maternity': return <Baby size={20} />;
      case 'Paternity': return <Baby size={20} />;
      default: return <UserX size={20} />;
    }
  };

  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Annual': return '#faad14';
      case 'Sick': return '#f5222d';
      case 'Casual': return '#52c41a';
      case 'Maternity': return '#eb2f96';
      case 'Paternity': return '#722ed1';
      default: return '#1890ff';
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {leaveBalances.map((balance: LeaveBalance, index: number) => {
          const usagePercent = (balance.taken / balance.totalAllocated) * 100;
          const remainingPercent = (balance.remaining / balance.totalAllocated) * 100;
          
          return (
            <Col xs={24} sm={12} lg={12} key={index}>
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
    </div>
  );
};

export default LeaveSummaryPanel;