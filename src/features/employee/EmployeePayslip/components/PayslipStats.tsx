import React from "react";
import { Row, Col } from "antd";
import { Wallet, DollarSign, CreditCard, Calendar } from "lucide-react";
import { StateCard } from "../../../../components/StateCard";
import { pakCurrency } from "../../../../constants";

interface PayslipStatsProps {
  stats: {
    totalPayslips: number;
    totalEarnings: number;
    totalDeductions: number;
    avgNetPay: number;
  };
}

const PayslipStats: React.FC<PayslipStatsProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<Wallet />}
          label="Average Net Pay"
          value={`${pakCurrency}${stats.avgNetPay.toFixed(2)}`}
          tone="pastelGreen"
          valueStyle={{ color: "#52c41a" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<DollarSign />}
          label="Total Earnings"
          value={`${pakCurrency}${stats.totalEarnings.toFixed(2)}`}
          tone="pastelBlue"
          valueStyle={{ color: "#1890ff" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<CreditCard />}
          label="Total Deductions"
          value={`${pakCurrency}${stats.totalDeductions.toFixed(2)}`}
          tone="pastelPink"
          valueStyle={{ color: "#f5222d" }}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StateCard
          icon={<Calendar />}
          label="Total Payslips"
          value={stats.totalPayslips.toString()}
          tone="softLavender"
          valueStyle={{ color: "#722ed1" }}
        />
      </Col>
    </Row>
  );
};

export default PayslipStats;
