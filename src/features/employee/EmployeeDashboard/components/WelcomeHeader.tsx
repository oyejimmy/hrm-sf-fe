import React from "react";
import { Avatar, Button, Space } from "antd";
import { BellOutlined, ProfileOutlined } from "@ant-design/icons";
import type { EmployeeProfile } from "../types";
import { SectionCard } from "./styles";

interface Props {
  profile: EmployeeProfile;
}

const WelcomeHeader: React.FC<Props> = ({ profile }) => {
  return (
    <SectionCard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={64} src={profile.avatarUrl} />
          <div>
            <h2 style={{ margin: 0 }}>Welcome back, {profile.name}!</h2>
            <p style={{ margin: 0, color: "#666" }}>
              {profile.designation} — {profile.department}
            </p>
          </div>
        </div>
        <Space>
          <Button icon={<BellOutlined />}>Notifications</Button>
          <Button icon={<ProfileOutlined />}>Profile</Button>
        </Space>
      </div>
    </SectionCard>
  );
};

export default WelcomeHeader;