import React from "react";
import { List, Tag } from "antd";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface Props {
  notifications: Notification[];
}

const Notifications: React.FC<Props> = ({ notifications }) => (
  <List
    bordered
    dataSource={notifications}
    renderItem={(item) => (
      <List.Item>
        <Tag color={item.type}>{item.type.toUpperCase()}</Tag>
        {item.message}
      </List.Item>
    )}
  />
);

export default Notifications;
