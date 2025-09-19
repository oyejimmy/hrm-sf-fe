import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Badge, Statistic, Row, Col } from 'antd';
import { Clock, Coffee, LogIn, LogOut, Watch, TrendingUp } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

// --- Type Definitions ---
// Replicating the type from the parent component to ensure consistency
interface TodayAttendance {
  date: string;
  checkIn: string | undefined;
  checkOut: string | undefined;
  breakStart: string | undefined;
  breakEnd: string | undefined;
  totalHours: number;
  breakMinutes: number;
  workingHours: number;
  status: 'Present' | 'Absent' | 'Late' | 'Pending';
  isOnBreak: boolean;
}

interface AttendanceClockPanelProps {
  todayAttendance: TodayAttendance;
  onAttendanceUpdate: (action: string) => void;
  loading: boolean;
}

type ClockType = 'digital' | 'analog';

// --- Styled Components with Keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  background: #f0f4f8;
  border-radius: 16px;
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const DigitalClock = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: #1a237e;
  font-family: 'Inter', sans-serif;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const AnalogClock = styled.div`
  width: 240px;
  height: 240px;
  border: 4px solid #455a64;
  border-radius: 50%;
  position: relative;
  margin: 20px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ClockHand = styled.div<{ $rotation: number; $length: number; $width: number; $color?: string; }>`
  position: absolute;
  background: ${props => props.$color || '#455a64'};
  transform-origin: bottom center;
  left: 50%;
  bottom: 50%;
  width: ${props => props.$width}px;
  height: ${props => props.$length}px;
  transform: translateX(-50%) rotate(${props => props.$rotation}deg);
  border-radius: ${props => props.$width / 2}px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ClockCenter = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: #1a237e;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10;
`;

const ClockNumber = styled.div<{ $position: number; }>`
  position: absolute;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #1a237e;
  transform: ${props => {
    const angle = (props.$position - 3) * 30;
    const radius = 90;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    return `translate(${x}px, ${y}px)`;
  }};
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
`;

const ActionButton = styled(Button)<{ $variant: string; }>`
  min-width: 140px;
  height: 52px;
  border-radius: 26px;
  font-weight: 600;
  font-size: 16px;
  margin: 0 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  
  ${props => {
    switch (props.$variant) {
      case 'check-in':
        return `
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(76,175,80,0.4);
            background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
          }
        `;
      case 'check-out':
        return `
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(244,67,54,0.4);
            background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
          }
        `;
      case 'break':
        return `
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(255,152,0,0.4);
            background: linear-gradient(135deg, #f57c00 0%, #ef6c00 100%);
          }
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: 768px) {
    min-width: 120px;
    height: 48px;
    margin: 4px;
    font-size: 14px;
  }
`;

const StatusCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 16px;
  }
`;

// --- Main Component ---
const AttendanceClockPanel: React.FC<AttendanceClockPanelProps> = ({ todayAttendance, onAttendanceUpdate, loading }) => {
  const { Text } = Typography;
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [clockType, setClockType] = useState<ClockType>('digital');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    onAttendanceUpdate('check_in');
  };

  const handleCheckOut = () => {
    onAttendanceUpdate('check_out');
  };

  const handleBreakStart = () => {
    onAttendanceUpdate('break_start');
  };

  const handleBreakEnd = () => {
    onAttendanceUpdate('break_end');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
      <AnalogClock>
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
          $color="#1a237e"
        />
        <ClockHand
          $rotation={minuteRotation}
          $length={95}
          $width={4}
          $color="#1a237e"
        />
        <ClockHand
          $rotation={secondRotation}
          $length={100}
          $width={2}
          $color="#f44336"
        />
        
        <ClockCenter />
      </AnalogClock>
    );
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const canCheckIn = !todayAttendance.checkIn;
  const canCheckOut = todayAttendance.checkIn && !todayAttendance.checkOut;
  const canStartBreak = todayAttendance.checkIn && !todayAttendance.isOnBreak && !todayAttendance.checkOut;
  const canEndBreak = todayAttendance.isOnBreak;

  return (
    <Card
      style={{
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '768px',
        margin: '0 auto',
      }}
    >
      <ClockContainer>
        <Button
          type="text"
          shape="round"
          icon={clockType === 'digital' ? <Clock /> : <Watch />}
          onClick={() => setClockType(clockType === 'digital' ? 'analog' : 'digital')}
          style={{ marginBottom: 20, color: '#455a64' }}
        >
          {clockType === 'digital' ? 'Switch to Analog' : 'Switch to Digital'}
        </Button>

        {clockType === 'digital' ? (
          <DigitalClock>{formatTime(currentTime)}</DigitalClock>
        ) : (
          renderAnalogClock()
        )}

        <Text style={{
          color: '#455a64',
          marginBottom: 32,
          fontSize: '16px',
          fontWeight: 500,
        }}>
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <Space size="large" wrap style={{ justifyContent: 'center' }}>
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
                  prefix={<Badge status={getStatusColor(todayAttendance.status)} />}
                  valueStyle={{ color: '#1a237e', fontSize: '16px' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Working Hours"
                  value={todayAttendance.workingHours}
                  suffix="h"
                  precision={1}
                  prefix={<TrendingUp size={16} />}
                  valueStyle={{ color: '#388E3C', fontSize: '16px' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Break Time"
                  value={todayAttendance.breakMinutes}
                  suffix="min"
                  prefix={<Coffee size={16} />}
                  valueStyle={{ color: '#f57c00', fontSize: '16px' }}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid #e0e0e0' }}>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '13px', color: '#455a64' }}>
                    <strong>Check-in:</strong> {new Date(todayAttendance.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Text>
                </Col>
                {todayAttendance.checkOut && (
                  <Col xs={24} sm={12}>
                    <Text style={{ fontSize: '13px', color: '#455a64' }}>
                      <strong>Check-out:</strong> {new Date(todayAttendance.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
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