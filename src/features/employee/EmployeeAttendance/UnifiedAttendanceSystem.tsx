import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge, Progress, Statistic, message } from 'antd';
import { Clock, Users, Calendar, TrendingUp, LogIn, LogOut, Coffee, Settings, Download } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../../contexts/ThemeContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const MainCard = styled(Card)`
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.6s ease-out;
  border: none;
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #2958C4 0%, #3D4C6F 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ClockSection = styled.div`
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const DigitalClock = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #2958C4;
  font-family: 'Courier New', monospace;
  margin: 16px 0;
  animation: ${pulse} 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const ActionButton = styled(Button)<{ $variant: string }>`
  min-width: 120px;
  height: 48px;
  border-radius: 24px;
  font-weight: 600;
  margin: 0 8px;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'check-in':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(16,185,129,0.3); }
        `;
      case 'check-out':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(239,68,68,0.3); }
        `;
      case 'break':
        return `
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(245,158,11,0.3); }
        `;
      default:
        return '';
    }
  }}
  
  @media (max-width: 768px) {
    min-width: 100px;
    height: 44px;
    margin: 4px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    padding: 16px;
    gap: 12px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const AttendanceList = styled.div`
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    max-height: 300px;
  }
`;

const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #2958C4;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const FloatingActions = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
  }
`;

const FloatingButton = styled(Button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2958C4 0%, #3D4C6F 100%);
  color: white;
  box-shadow: 0 8px 16px rgba(41,88,196,0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 24px rgba(41,88,196,0.4);
  }
`;

interface User {
  id: string;
  name: string;
  role: 'employee' | 'hr';
  department: string;
  avatar?: string;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Break';
  workingHours: number;
}

const UnifiedAttendanceSystem: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user] = useState<User>({ id: '1', name: 'John Doe', role: 'employee', department: 'Engineering' });
  const [todayStatus, setTodayStatus] = useState<'checked-out' | 'checked-in' | 'on-break'>('checked-out');
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { id: '1', employeeName: 'John Doe', checkIn: '09:00', checkOut: '18:00', status: 'Present', workingHours: 8 },
    { id: '2', employeeName: 'Jane Smith', checkIn: '09:15', status: 'Late', workingHours: 0 },
    { id: '3', employeeName: 'Mike Johnson', status: 'Absent', workingHours: 0 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setTodayStatus('checked-in');
    message.success('Checked in successfully!');
  };

  const handleCheckOut = () => {
    setTodayStatus('checked-out');
    message.success('Checked out successfully!');
  };

  const handleBreak = () => {
    setTodayStatus(todayStatus === 'on-break' ? 'checked-in' : 'on-break');
    message.success(todayStatus === 'on-break' ? 'Break ended' : 'Break started');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return '#10b981';
      case 'Late': return '#f59e0b';
      case 'Absent': return '#ef4444';
      case 'On Break': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Container>
      <MainCard>
        <Header>
          <UserInfo>
            <Avatar size={48} style={{ backgroundColor: '#C49629' }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{user.name}</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>{user.department} • {user.role.toUpperCase()}</p>
            </div>
          </UserInfo>
          <Badge status={todayStatus === 'checked-in' ? 'success' : todayStatus === 'on-break' ? 'warning' : 'default'} 
                 text={todayStatus === 'checked-in' ? 'Active' : todayStatus === 'on-break' ? 'On Break' : 'Offline'} />
        </Header>

        <ClockSection>
          <DigitalClock>{formatTime(currentTime)}</DigitalClock>
          <p style={{ color: '#64748b', margin: '8px 0 24px' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {todayStatus === 'checked-out' && (
              <ActionButton $variant="check-in" icon={<LogIn size={20} />} onClick={handleCheckIn}>
                Check In
              </ActionButton>
            )}
            {todayStatus === 'checked-in' && (
              <>
                <ActionButton $variant="check-out" icon={<LogOut size={20} />} onClick={handleCheckOut}>
                  Check Out
                </ActionButton>
                <ActionButton $variant="break" icon={<Coffee size={20} />} onClick={handleBreak}>
                  Start Break
                </ActionButton>
              </>
            )}
            {todayStatus === 'on-break' && (
              <ActionButton $variant="break" icon={<Coffee size={20} />} onClick={handleBreak}>
                End Break
              </ActionButton>
            )}
          </div>
        </ClockSection>

        <StatsGrid>
          <StatCard>
            <Statistic
              title="Today Present"
              value={45}
              prefix={<Users style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
            />
          </StatCard>
          <StatCard>
            <Statistic
              title="On Break"
              value={8}
              prefix={<Coffee style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StatCard>
          <StatCard>
            <Statistic
              title="Late Arrivals"
              value={3}
              prefix={<Clock style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatCard>
          <StatCard>
            <Statistic
              title="Attendance Rate"
              value={94.2}
              suffix="%"
              prefix={<TrendingUp style={{ color: '#2958C4' }} />}
              valueStyle={{ color: '#2958C4' }}
            />
            <Progress percent={94.2} strokeColor="#2958C4" showInfo={false} />
          </StatCard>
        </StatsGrid>

        {user.role === 'hr' && (
          <AttendanceList>
            <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>Today's Attendance</h3>
            {attendanceRecords.map(record => (
              <AttendanceItem key={record.id}>
                <div>
                  <strong>{record.employeeName}</strong>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {record.checkIn && `In: ${record.checkIn}`} 
                    {record.checkOut && ` • Out: ${record.checkOut}`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge color={getStatusColor(record.status)} text={record.status} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {record.workingHours}h
                  </span>
                </div>
              </AttendanceItem>
            ))}
          </AttendanceList>
        )}
      </MainCard>

      {user.role === 'hr' && (
        <FloatingActions>
          <FloatingButton icon={<Download size={20} />} title="Export Report" />
          <FloatingButton icon={<Settings size={20} />} title="Settings" />
        </FloatingActions>
      )}
    </Container>
  );
};

export default UnifiedAttendanceSystem;