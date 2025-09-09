import React from "react";
import { List, Flex } from "antd";
import { SectionCard } from "./styles";
import type { Holiday } from "../types";
import styled from "styled-components";

const holidays: Holiday[] = [
  { id: "h1", name: "Labour Day", date: "November 1, 2025", day: "Tuesday" },
  { id: "h2", name: "Independence Day", date: "March 4, 2025", day: "Friday" },
  { id: "h3", name: "Eid Ul Fitr", date: "April 23, 2025", day: "Monday" },
  { id: "h4", name: "Eid Ul Fitr", date: "April 23, 2025", day: "Monday" },
  { id: "h5", name: "Eid Ul Fitr", date: "April 23, 2025", day: "Monday" },
  { id: "h6", name: "Eid Ul Fitr", date: "April 23, 2025", day: "Monday" },
];

// 🎨 Scroll container with hidden scrollbar until hover
const ScrollContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 12px;

  /* Hide scrollbar initially */
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 12px;
    transition: background-color 0.3s;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: #1890ff; /* show on hover */
  }

  /* Firefox */
  scrollbar-width: none; /* hidden by default */
  &:hover {
    scrollbar-width: thin;
    scrollbar-color: #1890ff transparent;
  }
`;

// 📋 Styled List Item
const StyledListItem = styled(List.Item)`
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 14px 20px; /* more horizontal padding */
  margin-bottom: 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }
`;

// 🖌️ Holiday name styling
const Title = styled.span`
  color: #1890ff; /* ✅ blue */
  font-weight: 600;
  font-size: 25px; /* ✅ enlarged */
  padding-left: 20px; /* spacing from left border */
`;

// 📐 Right-side text (date + day)
const RightText = styled.div`
  text-align: right;
  font-size: 13px;
  color: #333;
  padding-right: 20px; /* ✅ spacing from right edge */

  span {
    display: block;
    color: #999;
    font-size: 11px;
  }
`;

const UpcomingHolidays = () => (
  <SectionCard title="Upcoming Holidays" bordered={false}>
    <ScrollContainer>
      <List
        dataSource={holidays}
        renderItem={(item: Holiday) => (
          <StyledListItem key={item.id}>
            <Flex justify="space-between" align="center" style={{ width: "100%" }}>
              <Title>{item.name}</Title>
              <RightText>
                {item.date}
                <span>{item.day}</span>
              </RightText>
            </Flex>
          </StyledListItem>
        )}
      />
    </ScrollContainer>
  </SectionCard>
);

export default UpcomingHolidays;
