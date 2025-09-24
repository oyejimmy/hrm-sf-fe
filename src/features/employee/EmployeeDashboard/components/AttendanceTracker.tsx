import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Space, Tag, Modal, Calendar, Badge, message, Spin } from 'antd';
import { CheckCircle, XCircle, Coffee } from 'lucide-react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../services/api/api';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Text } = Typography;

const StyledCard = styled(Card)<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? '#1f1f1f' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? '#444' : '#f0f0f0'};
  border-radius: 8px;
  
  .ant-card-head {
    background: ${props => props.$isDarkMode ? '#1f1f1f' : '#ffffff'};
    border-bottom: 1px solid ${props => props.$isDarkMode ? '#444' : '#f0f0f0'};
  }
  
  .ant-card-head-title {
    color: ${props => props.$isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)'};
  }
`;

const TimeCard = styled.div<{ $isDarkMode: boolean; $type: 'checkin' | 'checkout' | 'break' }>`
  padding: 16px;
  border-radius: 8px;
  background: ${props => {
    if (props.$type === 'checkin') return props.$isDarkMode ? '#0f3460' : '#e6f7ff';
    if (props.$type === 'checkout') return props.$isDarkMode ? '#3d1a00' : '#fff2e8';
    return props.$isDarkMode ? '#162312' : '#f6ffed';
  }};
  border: 1px solid ${props => {
    if (props.$type === 'checkin') return props.$isDarkMode ? '#1890ff' : '#91d5ff';
    if (props.$type === 'checkout') return props.$isDarkMode ? '#fa8c16' : '#ffd591';
    return props.$isDarkMode ? '#52c41a' : '#b7eb8f';
  }};
  text-align: center;
  height: 100%;
`;

interface AttendanceTrackerProps {
  isDarkMode: boolean;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ isDarkMode }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch today's attendance
  const { data: todayAttendance, isLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => api.get('/api/attendance/today').then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Fetch calendar data
  const currentDate = dayjs();
  const { data: calendarData } = useQuery({
    queryKey: ['attendance-calendar', currentDate.year(), currentDate.month() + 1],
    queryFn: () => api.get(`/api/attendance/calendar?year=${currentDate.year()}&month=${currentDate.month() + 1}`).then(res => res.data),
    enabled: isCalendarVisible,
  });

  // Mutations
  const checkInMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-in'),
    onSuccess: () => {
      message.success('Checked in successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check in');
    }
  });
  
  const checkOutMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-out'),
    onSuccess: () => {
      message.success('Checked out successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to check out');
    }
  });
  
  const startBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/start'),
    onSuccess: () => {
      message.success('Break started!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to start break');
    }
  });
  
  const endBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/end'),
    onSuccess: () => {
      message.success('Break ended!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to end break');
    }
  });
  
  const handleCheckIn = () => checkInMutation.mutate();
  const handleCheckOut = () => checkOutMutation.mutate();
  const handleBreak = () => {
    if (todayAttendance?.is_on_break) {
      endBreakMutation.mutate();
    } else {
      startBreakMutation.mutate();
    }
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayData = calendarData?.[dateStr];
    const listData = [];
    
    if (dayData) {
      const statusMap = {
        'present': { type: 'success', content: 'Present' },
        'absent': { type: 'error', content: 'Absent' },
        'late': { type: 'warning', content: 'Late' },
        'half_day': { type: 'processing', content: 'Half Day' },
        'on_leave': { type: 'default', content: 'On Leave' }
      };
      
      const statusInfo = statusMap[dayData.status as keyof typeof statusMap];
      if (statusInfo) {
        listData.push(statusInfo);
      }
    }
    
    return listData;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge 
              status={item.type as any} 
              text={item.content}
              style={{ fontSize: '10px' }}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <StyledCard 
        title="Today's Attendance" 
        $isDarkMode={isDarkMode}
        extra={
          <Button 
            type="link" 
            size="small"
            onClick={() => setIsCalendarVisible(true)}
          >
            View Calendar
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <TimeCard $isDarkMode={isDarkMode} $type="checkin">
              <CheckCircle size={24} color={isDarkMode ? '#1890ff' : '#1890ff'} />
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)' }}>
                  Check In
                </Text>
                <div style={{ fontSize: '12px', marginTop: 4 }}>
                  {todayAttendance?.check_in 
                    ? dayjs(todayAttendance.check_in, 'HH:mm:ss').format('hh:mm A')
                    : 'Not checked in'
                  }
                </div>
              </div>
            </TimeCard>
          </Col>
          
          <Col xs={24} sm={8}>
            <TimeCard $isDarkMode={isDarkMode} $type="break">
              <Coffee size={24} color={isDarkMode ? '#52c41a' : '#52c41a'} />
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)' }}>
                  Break Time
                </Text>
                <div style={{ fontSize: '12px', marginTop: 4 }}>
                  {todayAttendance?.is_on_break 
                    ? 'On Break' 
                    : `${todayAttendance?.total_break_time || 0} min used`
                  }
                </div>
              </div>
            </TimeCard>
          </Col>
          
          <Col xs={24} sm={8}>
            <TimeCard $isDarkMode={isDarkMode} $type="checkout">
              <XCircle size={24} color={isDarkMode ? '#fa8c16' : '#fa8c16'} />
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)' }}>
                  Check Out
                </Text>
                <div style={{ fontSize: '12px', marginTop: 4 }}>
                  {todayAttendance?.check_out 
                    ? dayjs(todayAttendance.check_out, 'HH:mm:ss').format('hh:mm A')
                    : 'Expected: 06:00 PM'
                  }
                </div>
              </div>
            </TimeCard>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            {isLoading ? (
              <div style={{ textAlign: 'center' }}>
                <Spin size="small" />
              </div>
            ) : (
              <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                {!todayAttendance?.check_in ? (
                  <Button 
                    type="primary" 
                    onClick={handleCheckIn}
                    loading={checkInMutation.isPending}
                  >
                    Check In
                  </Button>
                ) : !todayAttendance?.check_out ? (
                  <>
                    <Button 
                      type={todayAttendance?.is_on_break ? "default" : "primary"} 
                      onClick={handleBreak}
                      loading={startBreakMutation.isPending || endBreakMutation.isPending}
                    >
                      {todayAttendance?.is_on_break ? 'End Break' : 'Take Break'}
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      onClick={handleCheckOut}
                      loading={checkOutMutation.isPending}
                    >
                      Check Out
                    </Button>
                  </>
                ) : (
                  <Tag color="green">Work day completed</Tag>
                )}
              </Space>
            )}
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <div style={{ textAlign: 'center' }}>
              <Tag color={
                !todayAttendance?.check_in ? 'orange' :
                todayAttendance?.check_out ? 'blue' :
                todayAttendance?.is_on_break ? 'purple' : 'green'
              }>
                Status: {
                  !todayAttendance?.check_in ? 'Not Checked In' :
                  todayAttendance?.check_out ? `Completed (${todayAttendance.hours_worked || 'N/A'})` :
                  todayAttendance?.is_on_break ? 'On Break' : 'Working'
                }
              </Tag>
            </div>
          </Col>
        </Row>
      </StyledCard>

      <Modal
        title="Attendance Calendar"
        open={isCalendarVisible}
        onCancel={() => setIsCalendarVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '800px' }}
        styles={{
          body: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            color: isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)'
          },
          header: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            borderBottom: `1px solid ${isDarkMode ? '#444' : '#f0f0f0'}`
          },
          content: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }
        }}
      >
        <Calendar 
          dateCellRender={dateCellRender}
          style={{
            background: isDarkMode ? '#1f1f1f' : '#fff'
          }}
        />
      </Modal>
    </>
  );
};

export default AttendanceTracker;