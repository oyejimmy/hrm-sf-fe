import React from "react";
import styled from "styled-components";
import { Card, List, Button } from "antd";
import type { AttendanceNotification } from "../types";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 12px; }
`;

/** Props */
interface Props {
  notifications: AttendanceNotification[];
  onAcknowledge?: (id: string) => void;
}

const AttendanceNotifications: React.FC<Props> = ({ notifications, onAcknowledge }) => {
  return (
    <Wrapper title="Notifications & Alerts">
      <List
        dataSource={notifications}
        renderItem={(n) => (
          <List.Item key={n.id} actions={[<Button type="link" onClick={() => onAcknowledge?.(n.id)}>Acknowledge</Button>]}>
            <div style={{ width: "100%" }}>
              <div style={{ fontWeight: 700 }}>{n.message}</div>
              <div style={{ color: "#888", marginTop: 6 }}>{n.date}</div>
            </div>
          </List.Item>
        )}
      />
    </Wrapper>
  );
};

export default AttendanceNotifications;
