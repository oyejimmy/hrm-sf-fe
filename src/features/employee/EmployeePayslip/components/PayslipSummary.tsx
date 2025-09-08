import React from "react";
import { Card, Statistic, Button, Tag } from "antd";
import { Payslip } from "../types";
import { SummaryWrapper, HighlightedNet } from "./styles";

interface Props {
  latestPayslip: Payslip;
}

const PayslipSummary: React.FC<Props> = ({ latestPayslip }) => {
  return (
    <SummaryWrapper>
      <Card style={{ flex: 1, minWidth: "250px" }}>
        <Statistic
          title="Month"
          value={`${latestPayslip.month} ${latestPayslip.year}`}
        />
      </Card>
      <Card style={{ flex: 1, minWidth: "250px" }}>
        <Statistic
          title="Net Salary"
          valueRender={() => (
            <HighlightedNet>{latestPayslip.netPay} PKR</HighlightedNet>
          )}
        />
      </Card>
      <Card style={{ flex: 1, minWidth: "250px" }}>
        <Statistic
          title="Status"
          valueRender={() => (
            <Tag color={latestPayslip.status === "Paid" ? "green" : "orange"}>
              {latestPayslip.status}
            </Tag>
          )}
        />
      </Card>
      <Button type="primary" style={{ alignSelf: "center" }}>
        Download
      </Button>
    </SummaryWrapper>
  );
};

export default PayslipSummary;
