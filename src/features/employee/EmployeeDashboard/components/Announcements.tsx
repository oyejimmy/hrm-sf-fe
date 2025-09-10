import React from "react";
import { List, Card } from "antd";
import type { Announcement } from "../types";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../../../../contexts/ThemeContext";
import { BellOutlined } from "@ant-design/icons";

const announcements: (Announcement & { isNew?: boolean })[] = [
  {
    id: "an1",
    title: "Holiday Notice",
    description: "Company will be closed on December 25th for Christmas",
    date: "2025-12-20",
    type: "Holiday",
    isNew: true,
  },
  {
    id: "an2",
    title: "Policy Update",
    description: "New Work-from-home policy effective January 1st",
    date: "2025-12-15",
    type: "Policy",
    isNew: false,
  },
  {
    id: "an3",
    title: "Maintenance Window",
    description: "Scheduled maintenance on Sunday 2AM-4AM",
    date: "2025-12-10",
    type: "Maintenance",
    isNew: true,
  },
  {
    id: "an4",
    title: "Quarterly Meeting",
    description: "All-hands meeting scheduled for January 5th",
    date: "2025-12-08",
    type: "Meeting",
    isNew: false,
  },
  {
    id: "an5",
    title: "System Upgrade",
    description: "Upgrading internal systems to v2.1 on December 18th",
    date: "2025-12-05",
    type: "Maintenance",
    isNew: true,
  },
];

// 🔔 Keyframes for bell animation
const ring = keyframes`
  0%   { transform: rotate(0); }
  10%  { transform: rotate(15deg); }
  20%  { transform: rotate(-15deg); }
  30%  { transform: rotate(10deg); }
  40%  { transform: rotate(-10deg); }
  50%  { transform: rotate(5deg); }
  60%  { transform: rotate(-5deg); }
  70%  { transform: rotate(0); }
  100% { transform: rotate(0); }
`;

// 🔔 Animated Icon
const AnimatedBell = styled(BellOutlined)`
  font-size: 18px;
  cursor: pointer;
  animation: ${ring} 2s ease-in-out infinite;
  transform-origin: top center;
`;

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
  border-radius: 12px;
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

// ✅ Fixed SectionCard — strip out isDarkMode before forwarding
const SectionCard = styled(
  ({ isDarkMode, ...rest }: { isDarkMode: boolean } & React.ComponentProps<typeof Card>) => (
    <Card {...rest} />
  )
)`
  border-radius: 8px;
  margin-bottom: 16px;
  background: ${(props) => (props.isDarkMode ? "#2f2f2f" : "#fff")};
  box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 2px 8px rgba(255, 255, 255, 0.8)"
      : "0 2px 8px rgba(0, 0, 0, 0.09)"};
`;

// 📋 Styled List Item with shadow + smooth hover
const StyledListItem = styled(List.Item) <{ bg: string; isDarkMode: boolean }>`
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
    background: ${(props) => (props.isDarkMode ? "#2a2a2a" : props.bg)};
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

// 📍 Wrapper for each item
const ItemWrapper = styled.div`
  position: relative;
`;

// 🔴 Pulse animation for "NEW" badge
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const NewBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  animation: ${pulse} 1.5s infinite;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 9999;
  margin: 3px 8px;
`;

const Announcements = () => {
  const { isDarkMode } = useTheme();
  const loopItems = [...announcements, ...announcements];

  return (
    <SectionCard
      title="Announcements"
      isDarkMode={isDarkMode}
      extra={<AnimatedBell style={{ color: isDarkMode ? "#fff" : "#000" }} />}
    >
      <ScrollContainer>
        <ScrollContent>
          {loopItems.map((item, index) => (
            <ItemWrapper key={`${item.id}-${index}`}>
              {item.isNew && <NewBadge>NEW</NewBadge>}
              <StyledListItem
                bg={backgroundColors[index % backgroundColors.length]}
                isDarkMode={isDarkMode}
              >
                <List.Item.Meta
                  title={<strong>{item.title}</strong>}
                  description={
                    <div>
                      <div style={{ marginBottom: "4px" }}>
                        {item.description}
                      </div>
                      <span style={{ fontSize: "12px" }}>
                        {item.date}
                      </span>
                    </div>
                  }
                />
              </StyledListItem>
            </ItemWrapper>
          ))}
        </ScrollContent>
      </ScrollContainer>
    </SectionCard>
  );
};

export default Announcements;
