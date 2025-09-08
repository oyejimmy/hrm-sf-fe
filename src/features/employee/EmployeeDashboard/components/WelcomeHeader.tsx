import React from "react";
import { Avatar, Button, Space } from "antd";
import { SettingOutlined, CalendarOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { EmployeeProfile } from "../types";
import { SectionCard } from "./styles";

interface Props {
  profile: EmployeeProfile;
}

const WelcomeHeader: React.FC<Props> = ({ profile }) => {
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";

  return (
    <SectionCard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={64} src={profile.avatarUrl} />
          <div>
            <h2>{`${greeting}, ${profile.name} 👋`}</h2>
            <p style={{ margin: 0, color: "#666" }}>
              {profile.designation} — {profile.department}
            </p>
          </div>
        </div>
        <Space>
          <Button icon={<SettingOutlined />}>Profile</Button>
          <Button icon={<CalendarOutlined />}>Request Leave</Button>
          <Button icon={<QuestionCircleOutlined />}>Help</Button>
        </Space>
      </div>
    </SectionCard>
  );
};

export default WelcomeHeader;
