import React, { useState, useCallback } from "react";
import { List, Spin, Alert, Button, Tag } from "antd";
import styled, { keyframes } from "styled-components";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { StyledCard } from "./styles";
import { useAnnouncements, Announcement } from "../../../../hooks/api/useAnnouncements";

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

const NavButton = styled(Button)<{ isDarkMode: boolean }>`
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f5f5f5")};
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid #555" : "1px solid #d9d9d9"};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ isDarkMode }) => (isDarkMode ? "#444" : "#e6f7ff")};
    border-color: #1890ff;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:first-child {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &:last-child {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 300px;
`;

const ContentCenter = styled.div`
  flex: 1;
  margin: 0 60px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
`;

const AnnouncementCard = styled.div<{ isDarkMode: boolean }>`
  padding: 20px;
  border-radius: 12px;
  background: ${({ isDarkMode }) =>
    isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(24, 144, 255, 0.05)"};
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(24, 144, 255, 0.1)"};
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AnnouncementTitle = styled.h3<{ isDarkMode: boolean }>`
  color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#1890ff")};
  font-size: 1.4rem;
  margin-bottom: 12px;
  font-weight: 700;
`;

const AnnouncementContent = styled.p<{ isDarkMode: boolean }>`
  color: ${({ isDarkMode }) => (isDarkMode ? "#d9d9d9" : "#555")};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const AnnouncementMeta = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
  font-size: 0.85rem;
  color: ${({ isDarkMode }) => (isDarkMode ? "#bfbfbf" : "#888")};
`;

const Announcements = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: announcements = [], isLoading, error } = useAnnouncements();

  const goNext = useCallback(() => {
    if (announcements.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setTimeout(() => setIsAnimating(false), 100);
      }, 200);
    }
  }, [announcements.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (announcements.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
        setTimeout(() => setIsAnimating(false), 100);
      }, 200);
    }
  }, [announcements.length, isAnimating]);

  const currentAnnouncement = announcements[currentIndex];

  if (isLoading) {
    return (
      <StyledCard
        title="Announcements"
        loading={isLoading}
        $isDarkMode={isDarkMode}
        extra={<Bell size={18} />}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </StyledCard>
    );
  }

  if (error) {
    return (
      <StyledCard
        title="Announcements"
        $isDarkMode={isDarkMode}
        extra={<Bell size={18} />}
      >
        <Alert
          message="Error loading announcements"
          description="Unable to fetch announcement data. Please try again later."
          type="error"
          showIcon
        />
      </StyledCard>
    );
  }

  return (
    <StyledCard
      title="Announcements"
      $isDarkMode={isDarkMode}
      extra={<AnimatedBell isDarkMode={isDarkMode} />}
    >
      {currentAnnouncement ? (
        <ContentWrapper>
          {announcements.length > 1 && (
            <NavButton
              isDarkMode={isDarkMode}
              onClick={goPrev}
              aria-label="Previous announcement"
            >
              <ChevronLeft
                color={isDarkMode ? "#69c0ff" : "#1890ff"}
                size={20}
              />
            </NavButton>
          )}
          <ContentCenter style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          }}>
            <AnnouncementCard isDarkMode={isDarkMode}>
              <AnnouncementTitle isDarkMode={isDarkMode}>
                {currentAnnouncement.title}
              </AnnouncementTitle>
              <AnnouncementContent isDarkMode={isDarkMode}>
                {currentAnnouncement.content}
              </AnnouncementContent>
              <AnnouncementMeta isDarkMode={isDarkMode}>
                <Tag color={currentAnnouncement.priority === 'high' ? 'red' : currentAnnouncement.priority === 'medium' ? 'orange' : 'blue'}>
                  {currentAnnouncement.priority}
                </Tag>
                <span>{currentAnnouncement.publish_date}</span>
                {currentAnnouncement.is_new && (
                  <Tag color="green">NEW</Tag>
                )}
              </AnnouncementMeta>
            </AnnouncementCard>
          </ContentCenter>
          {announcements.length > 1 && (
            <NavButton
              isDarkMode={isDarkMode}
              onClick={goNext}
              aria-label="Next announcement"
            >
              <ChevronRight
                color={isDarkMode ? "#69c0ff" : "#1890ff"}
                size={20}
              />
            </NavButton>
          )}
        </ContentWrapper>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Bell
            size={48}
            style={{ marginBottom: "16px", opacity: 0.5 }}
            color={isDarkMode ? "#666" : "#ccc"}
          />
          <p style={{ color: isDarkMode ? "#999" : "#666" }}>
            No announcements available
          </p>
        </div>
      )}
    </StyledCard>
  );
};

export default Announcements;
