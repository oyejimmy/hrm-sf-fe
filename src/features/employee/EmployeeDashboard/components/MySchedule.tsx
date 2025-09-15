import React from "react";
import { List, Tag } from "antd";
import { StyledCard } from "./styles";
import type { ScheduleEvent } from "../types";
import { useTheme } from "../../../../contexts/ThemeContext";
import { CalendarDays, Users, GraduationCap, Circle } from "lucide-react";
import styled from "styled-components";

interface Props {
    events: ScheduleEvent[];
}

// Styled calendar days icon for the card header
const ScheduleIcon = styled(CalendarDays)<{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  color: ${props => props.isDarkMode ? '#f0f0f0' : '#000'};
`;

// Scroll container with fixed height
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

// Styled list item
const ScheduleItem = styled(List.Item)<{ isDarkMode: boolean }>`
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

  .ant-list-item-content {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const EventContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`;

const EventDetails = styled.div`
  flex: 1;
`;

const EventTitle = styled.strong<{ isDarkMode: boolean }>`
  color: ${props => props.isDarkMode ? '#f0f0f0' : '#000'};
  margin-bottom: 4px;
  display: block;
`;

const EventDate = styled.span<{ isDarkMode: boolean }>`
  color: ${props => props.isDarkMode ? '#bbb' : '#666'};
  font-size: 12px;
  display: block;
  margin-bottom: 8px;
`;

// Helper function to get the appropriate icon based on event type
const getEventIcon = (type: string) => {
  switch (type) {
    case "Meeting":
      return <Users size={18} color="#1890ff" />;
    case "Training":
      return <GraduationCap size={18} color="#52c41a" />;
    default:
      return <Circle size={18} color="#fa8c16" />;
  }
};

const MySchedule: React.FC<Props> = ({ events }) => {
    const { isDarkMode } = useTheme();
    
    return (
      <StyledCard 
        title="My Schedule" 
        $isDarkMode={isDarkMode}
        extra={<ScheduleIcon isDarkMode={isDarkMode} />}
      >
        <ScrollContainer isDarkMode={isDarkMode}>
          <List
            dataSource={events}
            renderItem={(ev) => (
              <ScheduleItem key={ev.id} isDarkMode={isDarkMode}>
                <EventContent>
                  <IconContainer>
                    {getEventIcon(ev.type)}
                  </IconContainer>
                  <EventDetails>
                    <EventTitle isDarkMode={isDarkMode}>{ev.title}</EventTitle>
                    <EventDate isDarkMode={isDarkMode}>{ev.date}</EventDate>
                    <Tag color={ev.type === "Meeting" ? "blue" : ev.type === "Training" ? "green" : "orange"}>
                      {ev.type}
                    </Tag>
                  </EventDetails>
                </EventContent>
              </ScheduleItem>
            )}
          />
        </ScrollContainer>
      </StyledCard>
    );
};

export default MySchedule;