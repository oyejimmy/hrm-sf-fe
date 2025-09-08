import React from "react";
import styled from "styled-components";
import { Card, Progress } from "antd";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 12px; }
`;

/** Simple analytics panel - replace with charts as needed */
interface Props {
  monthlyPercent?: number;
  lateCount?: number;
  overtimeHours?: number;
}

const AttendanceAnalytics: React.FC<Props> = ({ monthlyPercent = 92, lateCount = 3, overtimeHours = 6 }) => {
  return (
    <Wrapper title="Attendance Analytics">
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ minWidth: 140 }}>
          <div style={{ fontWeight: 700 }}>Monthly Attendance</div>
          <Progress type="circle" percent={monthlyPercent} width={80} />
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontWeight: 700 }}>Late Arrivals</div>
          <div style={{ fontSize: 28, marginTop: 8 }}>{lateCount}</div>
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontWeight: 700 }}>Overtime Hours</div>
          <div style={{ fontSize: 28, marginTop: 8 }}>{overtimeHours}h</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default AttendanceAnalytics;
