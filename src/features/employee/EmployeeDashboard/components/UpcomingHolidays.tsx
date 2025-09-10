import React from "react";
import { List, Flex } from "antd";
import { StyledCard } from "./styles";
import type { Holiday } from "../types";
import styled from "styled-components";
import { Calendar } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";

const holidays: Holiday[] = [
  { id: "h1", name: "Labour Day", date: "November 1, 2025", day: "Tuesday" },
  { id: "h2", name: "Independence Day", date: "March 4, 2025", day: "Friday" },
  { id: "h3", name: "Eid Ul Fitr", date: "April 23, 2025", day: "Monday" },
  { id: "h4", name: "Eid Ul Adha", date: "June 28, 2025", day: "Saturday" },
  { id: "h5", name: "Christmas Day", date: "December 25, 2025", day: "Thursday" },
  { id: "h6", name: "New Year's Day", date: "January 1, 2026", day: "Wednesday" },
];

// 🎨 Scroll container with blue scrollbar
const ScrollContainer = styled.div<{ isDarkMode: boolean }>`
  max-height: 250px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 12px;

  /* Blue scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.isDarkMode ? "#2a2a2a" : "#f1f1f1"};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #40a9ff;
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #1890ff ${props => props.isDarkMode ? "#2a2a2a" : "#f1f1f1"};

  // Mobile responsiveness
  @media (max-width: 768px) {
    max-height: 200px;
    padding: 6px;
  }
`;

// 📋 Styled List Item
const StyledListItem = styled(List.Item)<{ isDarkMode: boolean }>`
  border: 1px solid ${props => props.isDarkMode ? "#444" : "#d9d9d9"};
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 10px;
  background: ${props => props.isDarkMode ? "#2a2a2a" : "#fff"};
  box-shadow: ${props => 
    props.isDarkMode 
      ? "0 2px 6px rgba(0, 0, 0, 0.3)" 
      : "0 2px 6px rgba(0, 0, 0, 0.08)"};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => 
      props.isDarkMode 
        ? "0 6px 14px rgba(0, 0, 0, 0.4)" 
        : "0 6px 14px rgba(0, 0, 0, 0.12)"};
  }

  // Mobile responsiveness
  @media (max-width: 768px) {
    padding: 12px 16px;
    margin-bottom: 8px;
  }
`;

// 🖌️ Holiday name styling
const Title = styled.span<{ isDarkMode: boolean }>`
  color: ${props => props.isDarkMode ? "#69c0ff" : "#1890ff"};
  font-weight: 600;
  font-size: 25px;
  padding-left: 20px;

  // Mobile responsiveness
  @media (max-width: 768px) {
    font-size: 18px;
    padding-left: 10px;
  }
`;

// 📐 Right-side text (date + day)
const RightText = styled.div<{ isDarkMode: boolean }>`
  text-align: right;
  font-size: 13px;
  color: ${props => props.isDarkMode ? "#f0f0f0" : "#333"};
  padding-right: 20px;

  span {
    display: block;
    color: ${props => props.isDarkMode ? "#bfbfbf" : "#999"};
    font-size: 11px;
  }

  // Mobile responsiveness
  @media (max-width: 768px) {
    padding-right: 10px;
    font-size: 12px;
    
    span {
      font-size: 10px;
    }
  }
`;

// Styled calendar icon for the card header
const CalendarIcon = styled(Calendar)<{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  color: ${props => props.isDarkMode ? '#69c0ff' : '#1890ff'};
`;

const UpcomingHolidays = ({ isDarkMode }: { isDarkMode: boolean }) => {
  
  return (
    <StyledCard
      title="Upcoming Holidays"
      $isDarkMode={isDarkMode}
      extra={<CalendarIcon isDarkMode={isDarkMode} />}
    >
      <ScrollContainer isDarkMode={isDarkMode}>
        <List
          dataSource={holidays}
          renderItem={(item: Holiday) => (
            <StyledListItem key={item.id} isDarkMode={isDarkMode}>
              <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                <Title isDarkMode={isDarkMode}>{item.name}</Title>
                <RightText isDarkMode={isDarkMode}>
                  {item.date}
                  <span>{item.day}</span>
                </RightText>
              </Flex>
            </StyledListItem>
          )}
        />
      </ScrollContainer>
    </StyledCard>
  );
};

export default UpcomingHolidays;