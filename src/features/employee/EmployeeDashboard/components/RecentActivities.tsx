import { List, Tag } from "antd";
import styled from "styled-components";
import {
  FileText,
  UserPlus,
  CheckCircle,
  DollarSign,
  CalendarCheck,
  Clock,
} from "lucide-react";

// Theme-aware styled components
const StyledCard = styled.div<{ isDarkMode: boolean }>`
  background: ${(props) => (props.isDarkMode ? "#1f1f1f" : "#fff")};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  color: ${(props) => (props.isDarkMode ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)")};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
  
  h3 {
    margin: 0;
    font-weight: 600;
    font-size: 18px;
    color: ${(props) => (props.isDarkMode ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)")};
  }
`;

const ScrollContainer = styled.div<{ isDarkMode: boolean }>`
  height: 270px; /* Fixed height to show exactly 3 items */
  overflow-y: auto;
  padding: 4px 8px 4px 4px;
  border-radius: 8px;
  scrollbar-gutter: stable;
  margin-right: -4px;

  // Scrollbar styling
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  &:hover {
    overflow-y: auto;
    -ms-overflow-style: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }
    
    &::-webkit-scrollbar-track {
      background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f1f1f1")};
      border-radius: 4px;
      margin: 4px 0;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #1890ff;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #40a9ff;
    }

    scrollbar-color: #1890ff ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f1f1f1")};
  }

  @media (max-width: 768px) {
    height: 250px;
    padding: 4px 6px 4px 4px;
  }
`;

const ActivityList = styled(List)`
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled(List.Item) <{ isDarkMode: boolean }>`
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
    font-size: 14px;
  }
  
  .ant-list-item-meta-description {
    color: ${(props) => (props.isDarkMode ? "#bbb" : "#666")};
    font-size: 12px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .ant-list-item-meta {
      flex-direction: column;
    }
    
    .ant-list-item-meta-avatar {
      margin-bottom: 8px;
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  
  @media (max-width: 480px) {
    margin-right: 8px;
    width: 28px;
    height: 28px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    
    .ant-tag {
      align-self: flex-start;
    }
  }
  
  @media (max-width: 480px) {
    .ant-tag {
      font-size: 11px;
      padding: 2px 6px;
    }
  }
`;

const ClockIcon = styled(Clock) <{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  color: ${(props) => (props.isDarkMode ? '#f0f0f0' : '#000')};
`;

const ShowMoreButton = styled.div<{ isDarkMode: boolean }>`
  text-align: center;
  padding: 12px;
  color: ${(props) => (props.isDarkMode ? "#1890ff" : "#1890ff")};
  cursor: pointer;
  font-weight: 500;
  border-top: 1px dashed ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
  margin-top: 8px;
  
  &:hover {
    color: ${(props) => (props.isDarkMode ? "#40a9ff" : "#40a9ff")};
  }
`;

// Sample data
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
  {
    id: "a6",
    action: "Quarterly performance reviews scheduled",
    time: "4 days ago",
    date: "2025-09-06",
    status: "New",
  },
  {
    id: "a7",
    action: "New company policy document uploaded",
    time: "5 days ago",
    date: "2025-09-07",
    status: "Completed",
  },
];

// Helper functions
const getStatusTag = (status: string) => {
  const statusConfig: Record<string, { color: string, text: string }> = {
    "Pending": { color: "blue", text: "Pending" },
    "New": { color: "orange", text: "New" },
    "Completed": { color: "green", text: "Completed" },
  };

  const config = statusConfig[status] || { color: "default", text: status };
  return <Tag color={config.color}>{config.text}</Tag>;
};

const getActivityIcon = (id: string) => {
  const iconMap: Record<string, JSX.Element> = {
    "a1": <CalendarCheck size={18} color="#1890ff" />,
    "a5": <CalendarCheck size={18} color="#1890ff" />,
    "a2": <UserPlus size={18} color="#fa8c16" />,
    "a3": <CheckCircle size={18} color="#52c41a" />,
    "a4": <DollarSign size={18} color="#13c2c2" />,
  };

  return iconMap[id] || <FileText size={18} color="#999" />;
};

// Main component
const RecentActivities = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <StyledCard isDarkMode={isDarkMode}>
      <CardHeader isDarkMode={isDarkMode}>
        <h3>Recent Activities</h3>
        <ClockIcon isDarkMode={isDarkMode} />
      </CardHeader>

      <ScrollContainer isDarkMode={isDarkMode}>
        <ActivityList
          dataSource={activities}
          renderItem={(item: any) => (
            <ActivityItem key={item.id} isDarkMode={isDarkMode}>
              <List.Item.Meta
                avatar={
                  <IconContainer>
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
            </ActivityItem>
          )}
        />
      </ScrollContainer>
    </StyledCard>
  );
};

export default RecentActivities;