// AdminDashboard/components/AttendanceTrends.tsx
import React from "react";
import { List } from "antd";
import { SectionCard } from "./styles";
import type { AttendanceTrendPoint } from "../types";

interface Props {
  trends: AttendanceTrendPoint[];
}

/** lightweight attendance trend listing; user can swap for charts later */
const AttendanceTrends: React.FC<Props> = ({ trends }) => {
  return (
    <SectionCard title="Attendance & Leave Trends">
      <List
        dataSource={trends.slice(0, 7)} // show last 7 points
        renderItem={(t) => (
          <List.Item key={t.date}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div>{t.date}</div>
              <div>{t.present} present • {t.absent} absent</div>
            </div>
          </List.Item>
        )}
      />
    </SectionCard>
  );
};

export default AttendanceTrends;
