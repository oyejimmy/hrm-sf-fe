import React from "react";
import styled from "styled-components";
import { Card, List, Progress, Button } from "antd";
import type { LeaveBalance } from "../../EmployeeLeaveManagement/types";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 12px; }
`;

/** Props */
interface Props {
  balances: LeaveBalance[];
  onRequestLeave?: () => void;
}

const LeaveBalanceCard: React.FC<Props> = ({ balances, onRequestLeave }) => (
  <Wrapper title="Leave Balance & Requests" extra={<Button type="link" onClick={onRequestLeave}>Request Leave</Button>}>
    <List
      dataSource={balances}
      renderItem={(b) => {
        const percent = Math.round((b.taken / (b.taken + b.remaining || 1)) * 100);
        return (
          <List.Item key={b.type}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{b.type}</strong>
                <small>{b.taken} taken • {b.remaining} remaining</small>
              </div>
              <Progress percent={percent} size="small" />
            </div>
          </List.Item>
        );
      }}
    />
  </Wrapper>
);

export default LeaveBalanceCard;
