import React, { useState, useEffect } from "react";
import { Button, Space, Typography } from "antd";
import { Clock, Coffee, LogIn, LogOut, Watch } from "lucide-react";
import {
  ClockPanelCard,
  ClockContainer,
  DigitalClock,
  AnalogClock,
  ClockHand,
  ClockCenter,
  ClockNumber,
  ActionButton,
  EqualHeightContainer,
} from "./styles";
import { ClockType } from "../types";

const AttendanceClockPanel = ({
  todayAttendance,
  onAttendanceUpdate,
  loading,
  isDarkMode,
  isCheckingIn,
  isCheckingOut,
  isStartingBreak,
  isEndingBreak,
}: any) => {
  const { Text } = Typography;
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [clockType, setClockType] = useState<ClockType>("digital");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    onAttendanceUpdate("check_in");
  };

  const handleCheckOut = () => {
    onAttendanceUpdate("check_out");
  };

  const handleBreakStart = () => {
    onAttendanceUpdate("break_start");
  };

  const handleBreakEnd = () => {
    onAttendanceUpdate("break_end");
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getClockHandRotation = (value: number, total: number): number => {
    return (value / total) * 360;
  };

  const renderAnalogClock = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Adjust hours for 12-hour format, with 12 for 0 o'clock
    const displayHours = hours === 0 ? 12 : hours;

    const hourRotation = getClockHandRotation(displayHours * 60 + minutes, 720);
    const minuteRotation = getClockHandRotation(minutes, 60);
    const secondRotation = getClockHandRotation(seconds, 60);

    return (
      <AnalogClock isDarkMode={isDarkMode}>
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => (
          <ClockNumber key={i} $position={i + 1}>
            {i + 1}
          </ClockNumber>
        ))}

        {/* Clock hands */}
        <ClockHand
          $rotation={hourRotation}
          $length={70}
          $width={6}
          $color={isDarkMode ? "#ffffff" : "#1a237e"}
        />
        <ClockHand
          $rotation={minuteRotation}
          $length={95}
          $width={4}
          $color={isDarkMode ? "#ffffff" : "#1a237e"}
        />
        <ClockHand
          $rotation={secondRotation}
          $length={100}
          $width={2}
          $color={isDarkMode ? "#ffffff" : "#f44336"}
        />

        <ClockCenter />
      </AnalogClock>
    );
  };


  


  return (
    <EqualHeightContainer>
      <ClockPanelCard>
        <Button
          type="text"
          icon={clockType === "digital" ? <Clock /> : <Watch />}
          onClick={() =>
            setClockType(clockType === "digital" ? "analog" : "digital")
          }
          style={{ 
            color: isDarkMode ? "#ffffff" : "#455a64",
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1
          }}
        />
        <ClockContainer isDarkMode={isDarkMode}>
        {clockType === "digital" ? (
          <DigitalClock isDarkMode={isDarkMode}>
            {formatTime(currentTime)}
          </DigitalClock>
        ) : (
          renderAnalogClock()
        )}

        <Text
          style={{
            color: isDarkMode ? "#ffffff" : "#455a64",
            marginBottom: 32,
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Space size="large" wrap style={{ justifyContent: "center" }}>
          <ActionButton
            $variant="check-in"
            icon={<LogIn size={20} />}
            onClick={handleCheckIn}
            loading={isCheckingIn}
          >
            Check In
          </ActionButton>

          <ActionButton
            $variant="check-out"
            icon={<LogOut size={20} />}
            onClick={handleCheckOut}
            loading={isCheckingOut}
          >
            Check Out
          </ActionButton>

          <ActionButton
            $variant="break"
            icon={<Coffee size={20} />}
            onClick={handleBreakStart}
            loading={isStartingBreak}
          >
            Start Break
          </ActionButton>

          <ActionButton
            $variant="break"
            icon={<Coffee size={20} />}
            onClick={handleBreakEnd}
            loading={isEndingBreak}
          >
            End Break
          </ActionButton>
        </Space>
        </ClockContainer>
      </ClockPanelCard>
    </EqualHeightContainer>
  );
};

export default AttendanceClockPanel;
