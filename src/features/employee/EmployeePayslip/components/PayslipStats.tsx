// components/EmployeePayslip/components/PayslipStats.tsx
import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { Wallet, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { IconWrapper, StatisticCard } from './styles';

const { Title, Text } = Typography;

const PayslipStats: React.FC = () => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12} lg={6}>
        <StatisticCard>
          <IconWrapper $color="#52c41a">
            <Wallet size={20} />
          </IconWrapper>
          <Text type="secondary">Net Pay (Current)</Text>
          <Title level={3} style={{ margin: 0 }}>
            PKR5,200.50
          </Title>
        </StatisticCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatisticCard>
          <IconWrapper $color="#1890ff">
            <DollarSign size={20} />
          </IconWrapper>
          <Text type="secondary">Gross Pay</Text>
          <Title level={3} style={{ margin: 0 }}>
            PKR6,500.00
          </Title>
        </StatisticCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatisticCard>
          <IconWrapper $color="#faad14">
            <CreditCard size={20} />
          </IconWrapper>
          <Text type="secondary">Deductions</Text>
          <Title level={3} style={{ margin: 0 }}>
            PKR1,299.50
          </Title>
        </StatisticCard>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatisticCard>
          <IconWrapper $color="#ff4d4f">
            <Calendar size={20} />
          </IconWrapper>
          <Text type="secondary">Pay Period</Text>
          <Title level={3} style={{ margin: 0 }}>
            Oct 2023
          </Title>
        </StatisticCard>
      </Col>
    </Row>
  );
};

export default PayslipStats;