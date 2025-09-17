import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Switch, message, Badge, Statistic, Row, Col } from 'antd';
import { Clock, Coffee, LogIn, LogOut, User, Calendar, TrendingUp } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { TodayAttendance, ClockType } from '../types';
import { attendanceApi } from '../../../../services/api/attendanceApi';

const { Title, Text } = Typography;

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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const DigitalClock = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: #2958C4;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(41,88,196,0.1);
  animation: ${pulse} 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const AnalogClock = styled.div`
  width: 240px;
  height: 240px;
  border: 6px solid #2958C4;
  border-radius: 50%;
  position: relative;
  margin: 20px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 32px rgba(41,88,196,0.15);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ClockHand = styled.div<{ $rotation: number; $length: number; $width: number; $color?: string }>`
  position: absolute;
  background: ${props => props.$color || '#2958C4'};
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
  background: #2958C4;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(41,88,196,0.3);
  z-index: 10;
`;

const ClockNumber = styled.div<{ $position: number }>`
  position: absolute;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #2958C4;
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

const ActionButton = styled(Button)<{ $variant: string }>`
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(16,185,129,0.4);
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
          }
        `;
      case 'check-out':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(239,68,68,0.4);
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          }
        `;
      case 'break':
        return `
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
          color: white;
          &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(245,158,11,0.4);
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
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
  border: 1px solid #e2e8f0;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 16px;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.9);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
`;

interface AttendanceClockPanelProps {
  todayAttendance: TodayAttendance;
  onAttendanceUpdate: (attendance: TodayAttendance) => void;
  loading?: boolean;
}

const getClockHandRotation = (value: number, total: number) => {
  return (value / total) * 360;
};

const AttendanceClockPanel: React.FC<AttendanceClockPanelProps> = ({
  todayAttendance,
  onAttendanceUpdate,
  loading = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockType, setClockType] = useState<ClockType>('digital');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const result = await attendanceApi.checkIn();
      onAttendanceUpdate(result);
      message.success('Checked in successfully!');
    } catch (error) {
      message.error('Failed to check in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const result = await attendanceApi.checkOut();
      onAttendanceUpdate(result);
      message.success('Checked out successfully!');
    } catch (error) {
      message.error('Failed to check out');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakStart = async () => {
    setActionLoading(true);
    try {
      const result = await attendanceApi.startBreak();
      onAttendanceUpdate(result);
      message.success('Break started');
    } catch (error) {
      message.error('Failed to start break');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakEnd = async () => {
    setActionLoading(true);
    try {
      const result = await attendanceApi.endBreak();
      onAttendanceUpdate(result);
      message.success('Break ended');
    } catch (error) {
      message.error('Failed to end break');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };



  const renderAnalogClock = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return (
      <AnalogClock>
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => (
          <ClockNumber key={i} $position={i + 1}>
            {i + 1}
          </ClockNumber>
        ))}
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`marker-${i}`}
            style={{
              position: 'absolute',
              width: '3px',
              height: '25px',
              background: '#2958C4',
              left: '50%',
              top: '15px',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              borderRadius: '2px'
            }}
          />
        ))}
        
        {/* Minute markers */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            return (
              <div
                key={`min-marker-${i}`}
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '12px',
                  background: '#64748b',
                  left: '50%',
                  top: '15px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${i * 6}deg)`
                }}
              />
            );
          }
          return null;
        })}
        
        {/* Clock hands */}
        <ClockHand 
          $rotation={getClockHandRotation(hours * 60 + minutes, 720)} 
          $length={70} 
          $width={6} 
          $color="#2958C4"
        />
        <ClockHand 
          $rotation={getClockHandRotation(minutes, 60)} 
          $length={95} 
          $width={4} 
          $color="#2958C4"
        />
        <ClockHand 
          $rotation={getClockHandRotation(seconds, 60)} 
          $length={100} 
          $width={2} 
          $color="#ef4444"
        />
        
        <ClockCenter />
      </AnalogClock>
    );
  };

  const getStatusColor = (status: string) => {
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
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
      }}
    >
      <ClockContainer>
        <ToggleContainer>
          <Text style={{ fontWeight: 500, color: '#64748b' }}>Digital</Text>
          <Switch
            checked={clockType === 'analog'}
            onChange={(checked) => setClockType(checked ? 'analog' : 'digital')}
            style={{ backgroundColor: clockType === 'analog' ? '#2958C4' : '#64748b' }}
          />
          <Text style={{ fontWeight: 500, color: '#64748b' }}>Analog</Text>
        </ToggleContainer>

        {clockType === 'digital' ? (
          <DigitalClock>{formatTime(currentTime)}</DigitalClock>
        ) : (
          renderAnalogClock()
        )}

        <Text style={{ 
          color: '#64748b', 
          marginBottom: 32, 
          fontSize: '16px', 
          fontWeight: 500 
        }}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>

        <Space size="large" wrap style={{ justifyContent: 'center' }}>
          {canCheckIn && (
            <ActionButton
              $variant="check-in"
              icon={<LogIn size={20} />}
              onClick={handleCheckIn}
              loading={actionLoading}
            >
              Check In
            </ActionButton>
          )}

          {canCheckOut && (
            <ActionButton
              $variant="check-out"
              icon={<LogOut size={20} />}
              onClick={handleCheckOut}
              loading={actionLoading}
            >
              Check Out
            </ActionButton>
          )}

          {canStartBreak && (
            <ActionButton
              $variant="break"
              icon={<Coffee size={20} />}
              onClick={handleBreakStart}
              loading={actionLoading}
            >
              Start Break
            </ActionButton>
          )}

          {canEndBreak && (
            <ActionButton
              $variant="break"
              icon={<Coffee size={20} />}
              onClick={handleBreakEnd}
              loading={actionLoading}
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
                  valueStyle={{ color: '#2958C4', fontSize: '16px' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Working Hours"
                  value={todayAttendance.workingHours}
                  suffix="h"
                  precision={1}
                  prefix={<TrendingUp size={16} />}
                  valueStyle={{ color: '#10b981', fontSize: '16px' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Break Time"
                  value={todayAttendance.breakMinutes}
                  suffix="min"
                  prefix={<Coffee size={16} />}
                  valueStyle={{ color: '#f59e0b', fontSize: '16px' }}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid #e2e8f0' }}>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '13px', color: '#64748b' }}>
                    <strong>Check-in:</strong> {new Date(todayAttendance.checkIn).toLocaleTimeString()}
                  </Text>
                </Col>
                {todayAttendance.checkOut && (
                  <Col xs={24} sm={12}>
                    <Text style={{ fontSize: '13px', color: '#64748b' }}>
                      <strong>Check-out:</strong> {new Date(todayAttendance.checkOut).toLocaleTimeString()}
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