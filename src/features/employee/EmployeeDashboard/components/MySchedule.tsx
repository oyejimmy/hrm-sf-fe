import React from "react";
import { List, Tag } from "antd";
import { StyledCard } from "./styles";
import type { ScheduleEvent } from "../types";
import { useTheme } from "../../../../contexts/ThemeContext";
import { CalendarDays } from "lucide-react";
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

const MySchedule: React.FC<Props> = ({ events }) => {
    const { isDarkMode } = useTheme();
    
    return (
    <StyledCard 
      title="My Schedule" 
      $isDarkMode={isDarkMode}
      extra={<ScheduleIcon isDarkMode={isDarkMode} />}
    >
        <List
            dataSource={events}
            renderItem={(ev) => (
                <List.Item key={ev.id}>
                    <div>
                        <strong>{ev.title}</strong> — {ev.date}{" "}
                        <Tag color={ev.type === "Meeting" ? "blue" : ev.type === "Training" ? "green" : "orange"}>
                            {ev.type}
                        </Tag>
                    </div>
                </List.Item>
            )}
        />
    </StyledCard>
    );
};

export default MySchedule;
