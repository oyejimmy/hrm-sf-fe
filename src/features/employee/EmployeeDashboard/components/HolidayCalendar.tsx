import { useState, useEffect, useCallback } from "react";
import { Card, Button, Tag } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import styled from "styled-components";
import { useHolidays, Holiday } from '../../../../hooks/api/useHolidays';

// Fireworks component with 10-second animation
const Fireworks = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="firework"
          style={{
            position: "absolute",
            top: `${20 + Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: "1.5s",
          }}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(${Math.random() * 100 - 50}px, ${
        Math.random() * 100 - 50
      }px) scale(2); opacity: 0; }
        }
        .firework {
          width: 5px;
          height: 5px;
          background: hsl(${Math.random() * 360}, 100%, 60%);
          border-radius: 50%;
          box-shadow: 0 0 8px 2px currentColor;
          animation: firework ease-out infinite;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 8px;
  height: 400px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ isDarkMode }) =>
    isDarkMode
      ? "0 8px 24px rgba(0, 0, 0, 0.4)"
      : "0 8px 24px rgba(0, 0, 0, 0.1)"};
  background: ${({ isDarkMode }) => (isDarkMode ? "#1f1f1f" : "#ffffff")};
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid #444" : "1px solid #eaeaea"};
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  .ant-card-head {
    border-bottom: ${({ isDarkMode }) =>
      isDarkMode ? "1px solid #444" : "1px solid #f0f0f0"};
    color: ${({ isDarkMode }) => (isDarkMode ? "#e6f7ff" : "#333")};
    font-size: 1.1rem;
    padding: 14px 16px;
    font-weight: 600;
    flex-shrink: 0;

    @media (max-width: 480px) {
      padding: 12px;
    }
  }

  .ant-card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 480px) {
      padding: 16px;
    }
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 350px;
  }
`;

const HolidayTitle = styled.h3<{ isDarkMode: boolean }>`
  color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#1890ff")};
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const DateText = styled.p<{ isDarkMode: boolean }>`
  color: ${({ isDarkMode }) => (isDarkMode ? "#d9d9d9" : "#555")};
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 6px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const DayText = styled.p<{ isDarkMode: boolean }>`
  color: ${({ isDarkMode }) => (isDarkMode ? "#bfbfbf" : "#888")};
  text-align: center;
  font-size: 1rem;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
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
  }

  &:last-child {
    right: 0;
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
  margin-bottom: 20px;
  position: relative;
`;

const ContentCenter = styled.div`
  flex: 1;
  margin: 0 20px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const HolidayCounter = styled.div<{ isDarkMode: boolean }>`
  text-align: center;
  color: ${({ isDarkMode }) => (isDarkMode ? "#bfbfbf" : "#888")};
  margin-top: 12px;
  font-size: 0.9rem;
`;

const HolidayDescription = styled.div<{ isDarkMode: boolean }>`
  padding: 16px;
  margin-top: 20px;
  border-radius: 12px;
  background: ${({ isDarkMode }) =>
    isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(24, 144, 255, 0.05)"};
  color: ${({ isDarkMode }) => (isDarkMode ? "#d9d9d9" : "#555")};
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(24, 144, 255, 0.1)"};

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 0.85rem;
  }
`;

const HolidayTypeTag = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const HolidayCalendar = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: holidays = [], isLoading, error } = useHolidays();

  // Find nearest upcoming holiday and set as default
  useEffect(() => {
    if (holidays.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Find the nearest upcoming holiday
      let nearestIndex = 0;
      let minDiff = Infinity;
      holidays.forEach((holiday: Holiday, index: number) => {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);
        const diff = holidayDate.getTime() - today.getTime();
        // If holiday is today or in the future and closer than current nearest
        if (diff >= 0 && diff < minDiff) {
          minDiff = diff;
          nearestIndex = index;
        }
      });
      // If no upcoming holidays found, show the first one
      if (minDiff === Infinity) {
        nearestIndex = 0;
      }
      setCurrentIndex(nearestIndex);
    }
  }, [holidays]);

  const currentHoliday = holidays[currentIndex];

  const goNext = useCallback(() => {
    if (holidays.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % holidays.length);
        setTimeout(() => setIsAnimating(false), 100);
      }, 200);
    }
  }, [holidays.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (holidays.length > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + holidays.length) % holidays.length);
        setTimeout(() => setIsAnimating(false), 100);
      }, 200);
    }
  }, [holidays.length, isAnimating]);

  // Check if current holiday is today
  useEffect(() => {
    if (!currentHoliday) return;
    const today = new Date();
    const holidayDate = new Date(currentHoliday.date);
    const isToday =
      today.getDate() === holidayDate.getDate() &&
      today.getMonth() === holidayDate.getMonth() &&
      today.getFullYear() === holidayDate.getFullYear();
    if (isToday) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 10000);
      return () => clearTimeout(timer);
    } else {
      setShowFireworks(false);
    }
  }, [currentHoliday]);

  return (
    <StyledCard
      title="Holiday Calendar"
      loading={isLoading}
      isDarkMode={isDarkMode}
      extra={
        <CalendarIcon color={isDarkMode ? "#69c0ff" : "#1890ff"} size={18} />
      }
    >
      {showFireworks && <Fireworks />}
      {currentHoliday ? (
        <>
          <ContentWrapper>
            <NavButton
              isDarkMode={isDarkMode}
              onClick={goPrev}
              aria-label="Previous holiday"
            >
              <ChevronLeft
                color={isDarkMode ? "#69c0ff" : "#1890ff"}
                size={20}
              />
            </NavButton>
            <ContentCenter style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
            }}>
              <HolidayTitle isDarkMode={isDarkMode}>
                {currentHoliday.name}
              </HolidayTitle>
              <DateText isDarkMode={isDarkMode}>
                {new Date(currentHoliday.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DateText>
              <DayText isDarkMode={isDarkMode}>
                {new Date(currentHoliday.date).toLocaleDateString('en-US', {
                  weekday: 'long'
                })}
              </DayText>
              <HolidayTypeTag>
                <Tag color={currentHoliday.holiday_type === 'Public' ? 'blue' : currentHoliday.holiday_type === 'Religious' ? 'green' : 'orange'}>
                  {currentHoliday.holiday_type}
                </Tag>
              </HolidayTypeTag>
            </ContentCenter>
            <NavButton
              isDarkMode={isDarkMode}
              onClick={goNext}
              aria-label="Next holiday"
            >
              <ChevronRight
                color={isDarkMode ? "#69c0ff" : "#1890ff"}
                size={20}
              />
            </NavButton>
          </ContentWrapper>

          <HolidayDescription isDarkMode={isDarkMode}>
            {currentHoliday.description}
          </HolidayDescription>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CalendarIcon
            size={48}
            style={{ marginBottom: "16px", opacity: 0.5 }}
            color={isDarkMode ? "#666" : "#ccc"}
          />
          <p style={{ color: isDarkMode ? "#999" : "#666" }}>
            {error ? 'Unable to load holidays' : 'No holidays available'}
          </p>
        </div>
      )}
    </StyledCard>
  );
};

export default HolidayCalendar;