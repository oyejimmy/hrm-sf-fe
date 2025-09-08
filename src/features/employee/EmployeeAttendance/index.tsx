import React, { useState } from "react";
import styled from "styled-components";
import CheckInCheckOutPanel from "./components/CheckInCheckOutPanel";
import TodaySummary from "./components/TodaySummary";
import AttendanceCalendar from "./components/AttendanceCalendar";
import AttendanceHistoryTable from "./components/AttendanceHistoryTable";
import LeaveBalance from "./components/LeaveBalance";
import AttendanceAnalytics from "./components/AttendanceAnalytics";
import AttendanceNotifications from "./components/AttendanceNotifications";
import type {
  AttendanceRecord,
  TodayAttendance,
  LeaveBalance as LeaveBalanceType,
  ScheduleEvent,
  AttendanceNotification,
} from "./types";

// Page wrapper (local style)
const Page = styled.div`
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
  display: grid;
  gap: 18px;
`;

/** Demo / Mock Data */
const mockToday: TodayAttendance = {
  date: new Date().toISOString().slice(0, 10),
  checkIn: "09:05 AM",
  checkOut: undefined,
  totalHours: undefined,
  breakMinutes: 30,
  status: "Present",
};

const mockRecords: AttendanceRecord[] = [
  { id: "r1", date: "2025-09-01", checkIn: "09:05 AM", checkOut: "06:00 PM", totalHours: 8.9, breakMinutes: 60, status: "Present" },
  { id: "r2", date: "2025-09-02", checkIn: "09:30 AM", checkOut: "06:10 PM", totalHours: 8.7, breakMinutes: 50, status: "Late" },
  { id: "r3", date: "2025-09-03", checkIn: undefined, checkOut: undefined, status: "Absent" },
  { id: "r4", date: "2025-09-04", checkIn: "09:00 AM", checkOut: "05:45 PM", totalHours: 8.75, breakMinutes: 60, status: "Present" },
];

const mockLeave: LeaveBalanceType[] = [
  { type: "Annual Leave", taken: 5, remaining: 15 },
  { type: "Sick Leave", taken: 1, remaining: 9 },
  { type: "Casual Leave", taken: 2, remaining: 3 },
];

const mockNotifications: AttendanceNotification[] = [
  { id: "n1", message: "Reminder: Please check-in by 9:00 AM", date: "Today 08:45", level: "warning" },
  { id: "n2", message: "Leave request approved", date: "Yesterday", level: "info" },
];

const mockSchedule: ScheduleEvent[] = [
  { id: "s1", date: "2025-09-10", title: "Sprint Planning", type: "Meeting" },
  { id: "s2", date: "2025-09-15", title: "React Workshop", type: "Training" },
];

const AttendancePage: React.FC = () => {
  const [records] = useState<AttendanceRecord[]>(mockRecords);
  const [today] = useState<TodayAttendance>(mockToday);
  const [leaves] = useState<LeaveBalanceType[]>(mockLeave);
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(mockNotifications);

  const handleAcknowledge = (id: string) => {
    setNotifications((cur) => cur.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <Page>
      {/* Top row: check-in panel + today summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <CheckInCheckOutPanel initial={today} />
        <TodaySummary today={today} />
      </div>

      {/* Calendar + history */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 520px", gap: 16 }}>
        <AttendanceCalendar records={records} />
        <div style={{ display: "grid", gap: 16 }}>
          <AttendanceHistoryTable records={records} />
          <LeaveBalance balances={leaves} onRequestLeave={() => alert("Open leave modal")} />
        </div>
      </div>

      {/* analytics + notifications */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        <AttendanceAnalytics monthlyPercent={92} lateCount={3} overtimeHours={5} />
        <div style={{ display: "grid", gap: 16 }}>
          <AttendanceNotifications notifications={notifications} onAcknowledge={handleAcknowledge} />
          {/* Schedule view */}
          <div style={{ borderRadius: 12, padding: 12, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <h3 style={{ marginTop: 0 }}>My Schedule</h3>
            {mockSchedule.map(s => (
              <div key={s.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><strong>{s.title}</strong><div style={{ color: "#666", fontSize: 13 }}>{s.type}</div></div>
                  <div style={{ color: "#999" }}>{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AttendancePage;
