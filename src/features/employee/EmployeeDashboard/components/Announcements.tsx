import React from "react";
import { List, Spin } from "antd";
import styled, { keyframes } from "styled-components";
import { Bell } from "lucide-react";
import { StyledCard } from "./styles";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../services/api/api";

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
const AnimatedBell = styled(Bell)<{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  cursor: pointer;
  animation: ${ring} 2s ease-in-out infinite;
  transform-origin: top center;
  color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "#000")};
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

// 📋 Styled List Item with shadow + smooth hover
const StyledListItem = styled(List.Item)<{ bg: string; isDarkMode: boolean }>`
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

const Announcements = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.get("/api/announcements/").then((res) => res.data),
    refetchInterval: 3000000,
  });

  const loopItems = [...announcements, ...announcements];

  return (
    <StyledCard
      title="Announcements"
      loading={isLoading}
      $isDarkMode={isDarkMode}
      extra={!isLoading && <AnimatedBell isDarkMode={isDarkMode} />}
    >
      {!isLoading && (
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
                        <div style={{ marginBottom: "4px" }}>{item.content}</div>
                        <span style={{ fontSize: "12px" }}>
                          {item.publish_date}
                        </span>
                      </div>
                    }
                  />
                </StyledListItem>
              </ItemWrapper>
            ))}
          </ScrollContent>
        </ScrollContainer>
      )}
    </StyledCard>
  );
};

export default Announcements;
