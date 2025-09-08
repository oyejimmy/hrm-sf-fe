import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Button, Tag, Space, Tooltip } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { TodayAttendance } from "../types";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 16px; }
`;

const InfoRow = styled.div`
  display:flex;
  gap:12px;
  align-items:center;
  flex-wrap:wrap;
`;

const Timestamp = styled.div`
  color: #333;
  font-weight: 600;
`;

/**
 * Props:
 * - initial: optional object to render current status
 * - onCheckIn/Out: callbacks
 */
interface Props {
  initial?: TodayAttendance;
  onCheckIn?: (payload: { time: string; location?: string }) => void;
  onCheckOut?: (payload: { time: string; location?: string }) => void;
}

const getTimeString = () => new Date().toLocaleTimeString();

const CheckInCheckOutPanel: React.FC<Props> = ({ initial, onCheckIn, onCheckOut }) => {
  const [checkedIn, setCheckedIn] = useState<boolean>(!!initial?.checkIn && !initial?.checkOut);
  const [lastCheckIn, setLastCheckIn] = useState<string | undefined>(initial?.checkIn);
  const [lastCheckOut, setLastCheckOut] = useState<string | undefined>(initial?.checkOut);
  const [location, setLocation] = useState<string | undefined>(undefined);

  useEffect(() => {
    // If geolocation available — we can get coords (optional)
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          // ignore denied
        },
        { timeout: 3000 }
      );
    }
  }, []);

  const handleCheckIn = () => {
    const t = getTimeString();
    setCheckedIn(true);
    setLastCheckIn(t);
    onCheckIn?.({ time: t, location });
  };

  const handleCheckOut = () => {
    const t = getTimeString();
    setCheckedIn(false);
    setLastCheckOut(t);
    onCheckOut?.({ time: t, location });
  };

  return (
    <Wrapper title="Check-In / Check-Out">
      <InfoRow>
        <Space direction="vertical">
          <Space>
            <Button type="primary" size="large" onClick={handleCheckIn} disabled={checkedIn}>
              Check In
            </Button>
            <Button size="large" onClick={handleCheckOut} disabled={!checkedIn}>
              Check Out
            </Button>
          </Space>
          <div>
            <Timestamp>Last Check-in: {lastCheckIn ?? "—"}</Timestamp>
            <div style={{ color: "#666", fontSize: 13 }}>Last Check-out: {lastCheckOut ?? "—"}</div>
          </div>
        </Space>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <Tag color={checkedIn ? "green" : "red"} style={{ fontSize: 14 }}>
            {checkedIn ? "Present" : "Not Checked In"}
          </Tag>
          <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
            <Tooltip title={location ?? "Location not available"}>
              <EnvironmentOutlined /> {location ? `${location}` : "Location disabled"}
            </Tooltip>
            <div style={{ marginTop: 6 }}>
              <ClockCircleOutlined /> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </InfoRow>
    </Wrapper>
  );
};

export default CheckInCheckOutPanel;
