import React from "react";
import { List, Tag, Card } from "antd";
import styled from "styled-components";
import {
  FileText,
  UserPlus,
  CheckCircle,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";

// 📌 Mock data with different activity types
const activities = [
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

// 🎨 Styled Card with dark mode support
const StyledCard = styled(Card)<{isDarkMode: boolean }>`
  border-radius: 12px;
  box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 4px 12px rgba(255, 255, 255, 0.05)"
      : "0 4px 12px rgba(0, 0, 0, 0.08)"};
  background: ${(props) => (props.isDarkMode ? "#1f1f1f" : "#fff")};
  border: ${(props) => (props.isDarkMode ? "1px solid #444" : "1px solid #f0f0f0")};
  
  .ant-card-head {
    border-bottom: ${(props) => (props.isDarkMode ? "1px solid #444" : "1px solid #f0f0f0")};
    padding: 0 16px;
  }
  
  .ant-card-head-title {
    color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "#000")};
    font-weight: 600;
    padding: 16px 0;
  }
  
  .ant-card-body {
    padding: 16px;
  }
`;

// 🎨 Scroll container
const ScrollContainer = styled.div<{isDarkMode: boolean }>`
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 8px;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f5f5f5")};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.isDarkMode ? "#555" : "#ccc")};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => (props.isDarkMode ? "#777" : "#999")};
  }
`;

// 📋 List Item with dark/light mode
const StyledListItem = styled(List.Item)<{isDarkMode: boolean }>`
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#fff")};
  box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 2px 6px rgba(0, 0, 0, 0.2)"
      : "0 2px 6px rgba(0, 0, 0, 0.05)"};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 6px 14px rgba(0, 0, 0, 0.3)"
      : "0 6px 14px rgba(0, 0, 0, 0.1)"};
  }

  .ant-list-item-meta {
    align-items: flex-start;
  }

  .ant-list-item-meta-title {
    color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "#000")};
    margin-bottom: 4px;
    line-height: 1.4;
  }
  
  .ant-list-item-meta-description {
    color: ${(props) => (props.isDarkMode ? "#bbb" : "#999")};
    font-size: 12px;
  }
`;

// Icon container with proper spacing
const IconContainer = styled.div<{isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${(props) => (props.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)")};
  margin-right: 12px;
`;

// Title container with proper spacing
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

// ✅ Status tags
const getStatusTag = (status: any) => {
  switch (status) {
    case "Pending":
      return <Tag color="blue">Pending</Tag>;
    case "New":
      return <Tag color="orange">New</Tag>;
    case "Completed":
      return <Tag color="green">Completed</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

// ✅ Pick an icon based on activity type
const getActivityIcon = (id: any) => {
  switch (id) {
    case "a1":
    case "a5":
      return <CalendarCheck size={18} color="#1890ff" />;
    case "a2":
      return <UserPlus size={18} color="#fa8c16" />;
    case "a3":
      return <CheckCircle size={18} color="#52c41a" />;
    case "a4":
      return <DollarSign size={18} color="#13c2c2" />;
    default:
      return <FileText size={18} color="#999" />;
  }
};

const RecentActivities = () => {
  const { isDarkMode } = useTheme();
  console.log(isDarkMode);
  return (
    <StyledCard
      title="Recent Activities"
      isDarkMode={isDarkMode}
    >
      <ScrollContainer isDarkMode={isDarkMode}>
        <List
          dataSource={activities}
          renderItem={(item: any) => (
            <StyledListItem key={item.id} isDarkMode={isDarkMode}>
              <List.Item.Meta
                avatar={
                  <IconContainer isDarkMode={isDarkMode}>
                    {getActivityIcon(item.id)}
                  </IconContainer>
                }
                title={
                  <TitleContainer>
                    <span>{item.action}</span>
                    {getStatusTag(item.status)}
                  </TitleContainer>
                }
                description={
                  <span>
                    {item.time} • {item.date}
                  </span>
                }
              />
            </StyledListItem>
          )}
        />
      </ScrollContainer>
    </StyledCard>
  );
};

export default RecentActivities;