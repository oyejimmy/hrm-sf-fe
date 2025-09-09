import React from "react";
import { List } from "antd";
import { SectionCard } from "./styles";
import type { Announcement } from "../types";
import styled, { keyframes } from "styled-components";

const announcements: Announcement[] = [
  {
    id: "an1",
    title: "Holiday Notice",
    description: "Company will be closed on December 25th for Christmas",
    date: "2025-12-20",
    type: "Holiday",
  },
  {
    id: "an2",
    title: "Policy Update",
    description: "New Work-from-home policy effective January 1st",
    date: "2025-12-15",
    type: "Policy",
  },
  {
    id: "an3",
    title: "Maintenance Window",
    description: "Scheduled maintenance on Sunday 2AM-4AM",
    date: "2025-12-10",
    type: "Maintenance",
  },
];

// 🎨 Gradient backgrounds
const backgroundColors = [
  "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
  "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
  "linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)",
  "linear-gradient(135deg, #fff2e8 0%, #ffbb96 100%)",
  "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)",
  "linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)",
];

// 🔄 Keyframes for vertical infinite scroll
const scroll = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

// 📦 Wrapper with hidden overflow
const ScrollContainer = styled.div`
  height: 250px;
  overflow: hidden;
  position: relative;
`;

// 🌀 Animated inner container
const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${scroll} 15s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

// 📋 Styled List Item with shadow + smooth hover
const StyledListItem = styled(List.Item)<{ bg: string }>`
  padding: 12px;
  border: none;
  border-radius: 10px;
  margin-bottom: 12px;
  background: ${(props) => props.bg};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease; /* smooth transition */

  &:hover {
    transform: translateY(-3px); /* lift effect */
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  }
`;

const Announcements = () => {
  const loopItems = [...announcements, ...announcements];

  return (
    <SectionCard title="Announcements">
      <ScrollContainer>
        <ScrollContent>
          {loopItems.map((item, index) => (
            <StyledListItem
              key={`${item.id}-${index}`}
              bg={backgroundColors[index % backgroundColors.length]}
            >
              <List.Item.Meta
                title={
                  <strong style={{ color: "#262626" }}>{item.title}</strong>
                }
                description={
                  <div>
                    <div style={{ color: "#595959", marginBottom: "4px" }}>
                      {item.description}
                    </div>
                    <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      {item.date}
                    </span>
                  </div>
                }
              />
            </StyledListItem>
          ))}
        </ScrollContent>
      </ScrollContainer>
    </SectionCard>
  );
};

export default Announcements;
