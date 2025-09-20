import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Badge,
  Statistic,
  Row,
  Col,
} from "antd";
import { Clock, Coffee, LogIn, LogOut, Watch, TrendingUp } from "lucide-react";
import {
  ClockContainer,
  DigitalClock,
  AnalogClock,
  ClockHand,
  ClockCenter,
  ClockNumber,
  ActionButton,
  StatusCard,
} from "./styles";
import { ClockType } from "../types";

const AttendanceClockPanel = ({
  todayAttendance,
  onAttendanceUpdate,
  loading,
  isDarkMode,
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

  const getStatusColor = (
    status: string
  ): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "error";
      case "Late":
        return "warning";
      default:
        return "default";
    }
  };

  const canCheckIn = !todayAttendance.checkIn;
  const canCheckOut = todayAttendance.checkIn && !todayAttendance.checkOut;
  const canStartBreak =
    todayAttendance.checkIn &&
    !todayAttendance.isOnBreak &&
    !todayAttendance.checkOut;
  const canEndBreak = todayAttendance.isOnBreak;

  return (
    <Card
      style={{
        borderRadius: "16px",
        border: `${!isDarkMode} ? 'none' : '1px solid #e0e0e0'`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        maxWidth: "768px",
        margin: "0 auto",
      }}
    >
      <Button
        type="text"
        icon={clockType === "digital" ? <Clock /> : <Watch />}
        onClick={() =>
          setClockType(clockType === "digital" ? "analog" : "digital")
        }
        style={{ color: isDarkMode ? "#ffffff" : "#455a64" }}
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
          {canCheckIn && (
            <ActionButton
              $variant="check-in"
              icon={<LogIn size={20} />}
              onClick={handleCheckIn}
              loading={loading}
            >
              Check In
            </ActionButton>
          )}

          {canCheckOut && (
            <ActionButton
              $variant="check-out"
              icon={<LogOut size={20} />}
              onClick={handleCheckOut}
              loading={loading}
            >
              Check Out
            </ActionButton>
          )}

          {canStartBreak && (
            <ActionButton
              $variant="break"
              icon={<Coffee size={20} />}
              onClick={handleBreakStart}
              loading={loading}
            >
              Start Break
            </ActionButton>
          )}

          {canEndBreak && (
            <ActionButton
              $variant="break"
              icon={<Coffee size={20} />}
              onClick={handleBreakEnd}
              loading={loading}
            >
              End Break
            </ActionButton>
          )}
        </Space>

        {todayAttendance.checkIn && (
          <StatusCard>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Status"
                  value={todayAttendance.status}
                  prefix={
                    <Badge status={getStatusColor(todayAttendance.status)} />
                  }
                  valueStyle={{ color: "#1a237e", fontSize: "16px" }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Working Hours"
                  value={todayAttendance.workingHours}
                  suffix="h"
                  precision={1}
                  prefix={<TrendingUp size={16} />}
                  valueStyle={{ color: "#388E3C", fontSize: "16px" }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Break Time"
                  value={todayAttendance.breakMinutes}
                  suffix="min"
                  prefix={<Coffee size={16} />}
                  valueStyle={{ color: "#f57c00", fontSize: "16px" }}
                />
              </Col>
            </Row>

            <div
              style={{
                marginTop: 16,
                padding: "12px 0",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: "13px", color: "#455a64" }}>
                    <strong>Check-in:</strong>{" "}
                    {new Date(todayAttendance.checkIn).toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )}
                  </Text>
                </Col>
                {todayAttendance.checkOut && (
                  <Col xs={24} sm={12}>
                    <Text style={{ fontSize: "13px", color: "#455a64" }}>
                      <strong>Check-out:</strong>{" "}
                      {new Date(todayAttendance.checkOut).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit", hour12: true }
                      )}
                    </Text>
                  </Col>
                )}
              </Row>
            </div>
          </StatusCard>
        )}
      </ClockContainer>
    </Card>
  );
};

export default AttendanceClockPanel;
