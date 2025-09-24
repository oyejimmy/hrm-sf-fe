import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Spin } from "antd";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import styled from "styled-components";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../services/api/api';

// Fireworks component with 10-second animation
const Fireworks = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 10,
      overflow: "hidden"
    }}>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="firework"
          style={{
            position: "absolute",
            top: `${20 + Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: "1.5s"
          }}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(2); opacity: 0; }
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

interface Holiday {
  id: number;
  name: string;
  date: string;
  day: string;
  description: string;
  holiday_type: string;
}

const StyledCard = styled(Card) <{ isDarkMode: boolean }>`
  border-radius: 16px;
  box-shadow: ${({ isDarkMode }) =>
    isDarkMode ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 8px 24px rgba(0, 0, 0, 0.1)"};
  background: ${({ isDarkMode }) => (isDarkMode ? "#1f1f1f" : "#ffffff")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #444" : "1px solid #eaeaea")};
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  .ant-card-head {
    border-bottom: ${({ isDarkMode }) => (isDarkMode ? "1px solid #444" : "1px solid #f0f0f0")};
    color: ${({ isDarkMode }) => (isDarkMode ? "#e6f7ff" : "#333")};
    font-size: 1.1rem;
    padding: 14px 16px;
    font-weight: 600;
    
    @media (max-width: 480px) {
      padding: 12px;
    }
  }

  .ant-card-body {
    padding: 20px;
    
    @media (max-width: 480px) {
      padding: 16px;
    }
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

const NavButton = styled(Button) <{ isDarkMode: boolean }>`
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f5f5f5")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #555" : "1px solid #d9d9d9")};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ isDarkMode }) => (isDarkMode ? "#444" : "#e6f7ff")};
    border-color: #1890ff;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ContentCenter = styled.div`
  flex: 1;
  margin: 0 16px;
  min-width: 0;
`;

const HolidayCounter = styled.div<{ isDarkMode: boolean }>`
  text-align: center;
  color: ${({ isDarkMode }) => (isDarkMode ? "#bfbfbf" : "#888")};
  margin-top: 12px;
  font-size: 0.9rem;
`;

const HolidayDescription = styled.div<{ isDarkMode: boolean }>`
  padding: 14px;
  margin-top: 16px;
  border-radius: 8px;
  background: ${({ isDarkMode }) => (isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(24, 144, 255, 0.05)")};
  color: ${({ isDarkMode }) => (isDarkMode ? "#d9d9d9" : "#555")};
  font-size: 0.9rem;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.85rem;
  }
`;

const ThemeToggle = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 10px 16px;
  background: ${({ isDarkMode }) => isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(24, 144, 255, 0.1)"};
  border-radius: 8px;
  gap: 10px;
  cursor: pointer;
  
  span {
    color: ${({ isDarkMode }) => isDarkMode ? "#69c0ff" : "#1890ff"};
    font-weight: 500;
  }
`;

const UpcomingHolidays = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => api.get('/api/holidays/').then(res => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const currentHoliday = holidays[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % holidays.length);
  }, [holidays.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + holidays.length) % holidays.length);
  }, [holidays.length]);

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

  if (isLoading || !currentHoliday) {
    return (
      <StyledCard
        title="Holiday Calendar"
        isDarkMode={isDarkMode}
        extra={<CalendarIcon color={isDarkMode ? "#69c0ff" : "#1890ff"} size={18} />}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </StyledCard>
    );
  }

  return (
    <StyledCard
      title="Holiday Calendar"
      isDarkMode={isDarkMode}
      extra={<CalendarIcon color={isDarkMode ? "#69c0ff" : "#1890ff"} size={18} />}
    >
      {showFireworks && <Fireworks />}

      <ContentWrapper>
        <NavButton
          isDarkMode={isDarkMode}
          onClick={goPrev}
          aria-label="Previous holiday"
        >
          <ChevronLeft color={isDarkMode ? "#69c0ff" : "#1890ff"} size={20} />
        </NavButton>

        <ContentCenter>
          <HolidayTitle isDarkMode={isDarkMode}>{currentHoliday.name}</HolidayTitle>
          <DateText isDarkMode={isDarkMode}>{currentHoliday.date}</DateText>
          <DayText isDarkMode={isDarkMode}>{currentHoliday.day}</DayText>
        </ContentCenter>

        <NavButton
          isDarkMode={isDarkMode}
          onClick={goNext}
          aria-label="Next holiday"
        >
          <ChevronRight color={isDarkMode ? "#69c0ff" : "#1890ff"} size={20} />
        </NavButton>
      </ContentWrapper>

      <HolidayCounter isDarkMode={isDarkMode}>
        {currentIndex + 1} of {holidays.length}
      </HolidayCounter>

      <HolidayDescription isDarkMode={isDarkMode}>
        {currentHoliday.description}
      </HolidayDescription>
    </StyledCard>
  );
};

export default UpcomingHolidays;