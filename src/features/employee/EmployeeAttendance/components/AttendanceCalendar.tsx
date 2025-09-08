import React from "react";
import styled from "styled-components";
import { Card, Calendar, Tag } from "antd";
import type { AttendanceRecord } from "../types";

/**
 * Simple calendar with color coded day badges.
 * Accepts optional `records` array to map exact dates to statuses.
 */

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 8px; }
`;

/** Props */
interface Props {
  records?: AttendanceRecord[]; // map of date->status
}

/** Helper to map status to tag */
const statusTag = (status?: AttendanceRecord["status"]) => {
  if (!status) return null;
  const color = status === "Present" ? "green" : status === "Late" ? "orange" : status === "On Leave" ? "blue" : "red";
  return <Tag color={color} style={{ marginTop: 6 }}>{status}</Tag>;
};

const AttendanceCalendar: React.FC<Props> = ({ records = [] }) => {
  // easy lookup map
  const map = new Map(records.map(r => [r.date, r.status]));

  const dateCellRender = (value: any) => {
    // value is moment/dayjs-like object: format to YYYY-MM-DD
    const dateStr = value.format ? value.format("YYYY-MM-DD") : value.toISOString().slice(0,10);
    const status = map.get(dateStr);
    return <div style={{ display: "flex", justifyContent: "center" }}>{statusTag(status)}</div>;
  };

  return (
    <Wrapper title="Monthly Attendance Calendar">
      <Calendar dateCellRender={dateCellRender} />
    </Wrapper>
  );
};

export default AttendanceCalendar;
