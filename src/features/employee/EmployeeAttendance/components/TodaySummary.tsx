import React from "react";
import styled from "styled-components";
import { Card, Descriptions, Tag } from "antd";
import type { TodayAttendance } from "../types";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 12px; }
`;

interface Props {
  today?: TodayAttendance;
}

const TodaySummary: React.FC<Props> = ({ today }) => {
  const d = today ?? {
    date: new Date().toISOString().slice(0, 10),
    checkIn: undefined,
    checkOut: undefined,
    totalHours: undefined,
    breakMinutes: undefined,
    status: "Pending" as const,
  };

  return (
    <Wrapper title="Today's Attendance Summary">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Check-in Time">{d.checkIn ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Check-out Time">{d.checkOut ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Total Hours Worked">{d.totalHours != null ? `${d.totalHours} hrs` : "—"}</Descriptions.Item>
        <Descriptions.Item label="Break Duration">{d.breakMinutes != null ? `${d.breakMinutes} min` : "—"}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={d.status === "Present" ? "green" : d.status === "Late" ? "orange" : d.status === "On Leave" ? "blue" : "red"}>
            {d.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  );
};

export default TodaySummary;
