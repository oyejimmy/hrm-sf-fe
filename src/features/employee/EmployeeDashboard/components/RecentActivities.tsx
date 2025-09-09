import React from "react";
import { List, Tag } from "antd";
import { SectionCard } from "./styles";
import type { Activity } from "../types";
import styled from "styled-components";

const activities: Activity[] = [
  {
    id: "a1",
    action: "Sarah Johnson submitted a leave request",
    time: "2 hours ago",
    date: "2025-09-01",
    status: "Pending",
  },
  {
    id: "a2",
    action: "New candidate applied for Frontend Developer Position",
    time: "5 hours ago",
    date: "2025-09-02",
    status: "New",
  },
  {
    id: "a3",
    action: "ReactJS Training Module completed by 18 Employees",
    time: "1 day ago",
    date: "2025-09-03",
    status: "Completed",
  },
  {
    id: "a4",
    action: "Payroll processed for August",
    time: "2 days ago",
    date: "2025-09-04",
    status: "Completed",
  },
  {
    id: "a5",
    action: "Manager approved leave request for John Doe",
    time: "3 days ago",
    date: "2025-09-05",
    status: "Pending",
  },
];

// 🎨 Scroll container with padding + rounded edges
const ScrollContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  padding: 8px; /* ✅ inner padding so text doesn’t touch edges */
  border-radius: 12px; /* ✅ rounded top + bottom edges */
  scrollbar-gutter: stable;

  /* Hide scrollbar by default */
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 12px; /* ✅ rounded scrollbar thumb */
    transition: background-color 0.3s;
  }

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar-thumb {
    background-color: #1890ff;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  &:hover {
    scrollbar-color: #1890ff transparent;
  }
`;

// 📋 Styled List Item with shadow + hover lift
const StyledListItem = styled(List.Item)`
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 14px; /* ✅ more inner spacing for cleaner look */
  margin-bottom: 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }
`;

const getStatusTag = (status: string) => {
  switch (status) {
    case "Pending":
      return <Tag color="blue">Pending</Tag>;
    case "New":
      return <Tag color="orange">New</Tag>;
    case "Completed":
    case "Complete":
      return <Tag color="green">Completed</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const RecentActivities = () => (
  <SectionCard title="Recent Activities">
    <ScrollContainer>
      <List
        dataSource={activities}
        renderItem={(item) => (
          <StyledListItem key={item.id}>
            <List.Item.Meta
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0px 10px"
                  }}
                >
                  <span>{item.action}</span>
                  {getStatusTag(item.status)}
                </div>
              }
              description={
                <span style={{ padding: "0px 10px", fontSize: "12px", color: "#999" }}>
                  {item.time} • {item.date}
                </span>
              }
            />
          </StyledListItem>
        )}
      />
    </ScrollContainer>
  </SectionCard>
);

export default RecentActivities;
