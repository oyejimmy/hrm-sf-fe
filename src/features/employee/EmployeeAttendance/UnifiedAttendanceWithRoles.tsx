import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge, Progress, Statistic, message, Switch, Input, Select } from 'antd';
import { Clock, Users, LogIn, LogOut, Coffee, Settings, Download, Search, Filter, Edit3 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const MainCard = styled(Card)`
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
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
    gap: 16px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RoleToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const ClockSection = styled.div`
  text-align: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const DigitalClock = styled.div`
  font-size: 56px;
  font-weight: 800;
  color: #2958C4;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(41,88,196,0.1);
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
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
            transform: translateY(-3px); 
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
            transform: translateY(-3px); 
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
            transform: translateY(-3px); 
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatsSection = styled.div`
  padding: 32px;
  background: #ffffff;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const AttendanceSection = styled.div`
  padding: 32px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  
  @media (max-width: 1024px) {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const AttendanceControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled(Input)`
  max-width: 300px;
  border-radius: 20px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const AttendanceList = styled.div`
  max-height: 500px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin: 8px 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.3s ease-out;
  
  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
    border-color: #2958C4;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const FloatingActions = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

const FloatingButton = styled(Button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2958C4 0%, #3D4C6F 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(41,88,196,0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 28px rgba(41,88,196,0.4);
  }
`;

interface User {
  id: string;
  name: string;
  role: 'employee' | 'hr';
  department: string;
}

const UnifiedAttendanceWithRoles: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole, setUserRole] = useState<'employee' | 'hr'>('employee');
  const [todayStatus, setTodayStatus] = useState<'checked-out' | 'checked-in' | 'on-break'>('checked-out');
  const [searchTerm, setSearchTerm] = useState('');
  
  const user = { id: '1', name: 'John Doe', department: 'Engineering', role: userRole };
  
  const attendanceRecords = [
    { id: '1', employeeName: 'John Doe', checkIn: '09:00', checkOut: '18:00', status: 'Present', workingHours: 8, department: 'Engineering' },
    { id: '2', employeeName: 'Jane Smith', checkIn: '09:15', status: 'Late', workingHours: 7.5, department: 'Marketing' },
    { id: '3', employeeName: 'Mike Johnson', status: 'Absent', workingHours: 0, department: 'Sales' },
    { id: '4', employeeName: 'Sarah Wilson', checkIn: '08:45', status: 'On Break', workingHours: 4, department: 'HR' },
    { id: '5', employeeName: 'David Brown', checkIn: '09:30', status: 'Late', workingHours: 6, department: 'Engineering' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendanceAction = (action: string) => {
    switch (action) {
      case 'check-in':
        setTodayStatus('checked-in');
        message.success('✅ Checked in successfully!');
        break;
      case 'check-out':
        setTodayStatus('checked-out');
        message.success('👋 Checked out successfully!');
        break;
      case 'break':
        setTodayStatus(todayStatus === 'on-break' ? 'checked-in' : 'on-break');
        message.success(todayStatus === 'on-break' ? '⏰ Break ended' : '☕ Break started');
        break;
    }
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

  const filteredRecords = attendanceRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: attendanceRecords.filter(r => r.status === 'Present').length,
    absent: attendanceRecords.filter(r => r.status === 'Absent').length,
    late: attendanceRecords.filter(r => r.status === 'Late').length,
    onBreak: attendanceRecords.filter(r => r.status === 'On Break').length,
    total: attendanceRecords.length
  };

  return (
    <Container>
      <MainCard>
        <Header>
          <UserSection>
            <Avatar size={56} style={{ backgroundColor: '#C49629', fontSize: '20px' }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{user.name}</h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                {user.department} • {userRole.toUpperCase()}
              </p>
            </div>
          </UserSection>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <RoleToggle>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Employee</span>
              <Switch
                checked={userRole === 'hr'}
                onChange={(checked) => setUserRole(checked ? 'hr' : 'employee')}
                style={{ backgroundColor: userRole === 'hr' ? '#C49629' : '#64748b' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>HR</span>
            </RoleToggle>
            
            <Badge 
              status={todayStatus === 'checked-in' ? 'success' : todayStatus === 'on-break' ? 'warning' : 'default'} 
              text={
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {todayStatus === 'checked-in' ? 'Active' : todayStatus === 'on-break' ? 'On Break' : 'Offline'}
                </span>
              }
            />
          </div>
        </Header>

        <ClockSection>
          <DigitalClock>{formatTime(currentTime)}</DigitalClock>
          <p style={{ color: '#64748b', margin: '12px 0 32px', fontSize: '18px', fontWeight: '500' }}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {todayStatus === 'checked-out' && (
              <ActionButton $variant="check-in" icon={<LogIn size={20} />} onClick={() => handleAttendanceAction('check-in')}>
                Check In
              </ActionButton>
            )}
            {todayStatus === 'checked-in' && (
              <>
                <ActionButton $variant="check-out" icon={<LogOut size={20} />} onClick={() => handleAttendanceAction('check-out')}>
                  Check Out
                </ActionButton>
                <ActionButton $variant="break" icon={<Coffee size={20} />} onClick={() => handleAttendanceAction('break')}>
                  Start Break
                </ActionButton>
              </>
            )}
            {todayStatus === 'on-break' && (
              <ActionButton $variant="break" icon={<Coffee size={20} />} onClick={() => handleAttendanceAction('break')}>
                End Break
              </ActionButton>
            )}
          </div>
        </ClockSection>

        <ContentGrid>
          <StatsSection>
            <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
              {userRole === 'hr' ? 'Team Overview' : 'Your Statistics'}
            </h3>
            
            <StatsGrid>
              <StatCard>
                <Statistic
                  title="Present Today"
                  value={userRole === 'hr' ? stats.present : (todayStatus === 'checked-in' ? 1 : 0)}
                  prefix={<Users style={{ color: '#10b981' }} />}
                  valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: '700' }}
                />
              </StatCard>
              
              <StatCard>
                <Statistic
                  title="On Break"
                  value={userRole === 'hr' ? stats.onBreak : (todayStatus === 'on-break' ? 1 : 0)}
                  prefix={<Coffee style={{ color: '#f59e0b' }} />}
                  valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: '700' }}
                />
              </StatCard>
              
              {userRole === 'hr' && (
                <>
                  <StatCard>
                    <Statistic
                      title="Late Arrivals"
                      value={stats.late}
                      prefix={<Clock style={{ color: '#ef4444' }} />}
                      valueStyle={{ color: '#ef4444', fontSize: '28px', fontWeight: '700' }}
                    />
                  </StatCard>
                  
                  <StatCard>
                    <div>
                      <Statistic
                        title="Attendance Rate"
                        value={((stats.present + stats.late) / stats.total * 100)}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#2958C4', fontSize: '28px', fontWeight: '700' }}
                      />
                      <Progress 
                        percent={((stats.present + stats.late) / stats.total * 100)} 
                        strokeColor="#2958C4" 
                        showInfo={false}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  </StatCard>
                </>
              )}
            </StatsGrid>
          </StatsSection>

          <AttendanceSection>
            <AttendanceControls>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                {userRole === 'hr' ? "Today's Attendance" : 'Recent Activity'}
              </h3>
              
              {userRole === 'hr' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <SearchBar
                    placeholder="Search employees..."
                    prefix={<Search size={16} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select defaultValue="all" style={{ width: 120 }}>
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="present">Present</Select.Option>
                    <Select.Option value="absent">Absent</Select.Option>
                    <Select.Option value="late">Late</Select.Option>
                  </Select>
                </div>
              )}
            </AttendanceControls>

            <AttendanceList>
              {(userRole === 'hr' ? filteredRecords : filteredRecords.slice(0, 3)).map(record => (
                <AttendanceItem key={record.id}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                      {record.employeeName}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {record.department}
                      {record.checkIn && ` • In: ${record.checkIn}`}
                      {record.checkOut && ` • Out: ${record.checkOut}`}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Badge 
                      color={getStatusColor(record.status)} 
                      text={<span style={{ fontWeight: '500' }}>{record.status}</span>} 
                    />
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                      {record.workingHours}h
                    </span>
                    {userRole === 'hr' && (
                      <Button size="small" icon={<Edit3 size={14} />} type="text" />
                    )}
                  </div>
                </AttendanceItem>
              ))}
            </AttendanceList>
          </AttendanceSection>
        </ContentGrid>
      </MainCard>

      {userRole === 'hr' && (
        <FloatingActions>
          <FloatingButton icon={<Download size={24} />} title="Export Report" />
          <FloatingButton icon={<Settings size={24} />} title="Settings" />
        </FloatingActions>
      )}
    </Container>
  );
};

export default UnifiedAttendanceWithRoles;