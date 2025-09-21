import React from "react";
import { Row, Col } from "antd";
import { Wallet, DollarSign, CreditCard, Calendar } from "lucide-react";
import { StateCard } from "../../../../components/StateCard";

const PayslipStats: React.FC = () => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<Wallet />}
          label="Net Pay (Current)"
          value="PKR5,200.50"
          tone="pastelGreen"
          valueStyle={{ color: "#52c41a" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<DollarSign />}
          label="Gross Pay"
          value="PKR6,500.00"
          tone="pastelBlue"
          valueStyle={{ color: "#1890ff" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<CreditCard />}
          label="Deductions"
          value="PKR1,299.50"
          tone="pastelPink"
          valueStyle={{ color: "#f5222d" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<Calendar />}
          label="Pay Period"
          value="Oct 2023"
          tone="softLavender"
          valueStyle={{ color: "#722ed1" }}
        />
      </Col>
    </Row>
  );
};

export default PayslipStats;
