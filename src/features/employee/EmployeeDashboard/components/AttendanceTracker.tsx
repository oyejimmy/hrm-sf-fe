import React from 'react';
import { Button, Row, Col, Typography, Space, Tag, message } from 'antd';
import { CheckCircle, XCircle, Coffee } from 'lucide-react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../services/api/api';
import { StyledCard } from './styles';
import dayjs from 'dayjs';

const { Text } = Typography;

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
  const queryClient = useQueryClient();
  
  const { data: todayAttendance, isLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => api.get('/api/attendance/today').then(res => res.data),
    refetchInterval: 30000,
  });

  const checkInMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-in'),
    onSuccess: () => {
      message.success('Checked in successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => message.error(error.response?.data?.detail || 'Failed to check in')
  });

  const checkOutMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/check-out'),
    onSuccess: () => {
      message.success('Checked out successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => message.error(error.response?.data?.detail || 'Failed to check out')
  });

  const startBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/start'),
    onSuccess: () => {
      message.success('Break started!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => message.error(error.response?.data?.detail || 'Failed to start break')
  });

  const endBreakMutation = useMutation({
    mutationFn: () => api.post('/api/attendance/break/end'),
    onSuccess: () => {
      message.success('Break ended!');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (error: any) => message.error(error.response?.data?.detail || 'Failed to end break')
  });
  
  const handleBreak = () => {
    todayAttendance?.is_on_break ? endBreakMutation.mutate() : startBreakMutation.mutate();
  };

  const getStatusColor = () => {
    if (!todayAttendance?.check_in) return 'orange';
    if (todayAttendance?.check_out) return 'blue';
    if (todayAttendance?.is_on_break) return 'purple';
    return 'green';
  };

  const getStatusText = () => {
    if (!todayAttendance?.check_in) return 'Not Checked In';
    if (todayAttendance?.check_out) return `Completed (${todayAttendance.hours_worked || 'N/A'})`;
    if (todayAttendance?.is_on_break) return 'On Break';
    return 'Working';
  };

  return (
    <StyledCard 
      title="Today's Attendance" 
      $isDarkMode={isDarkMode}
      loading={isLoading}
    >
      {!isLoading && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <TimeCard $isDarkMode={isDarkMode} $type="checkin">
                <CheckCircle size={24} color="#1890ff" />
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
                <Coffee size={24} color="#52c41a" />
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
                <XCircle size={24} color="#fa8c16" />
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
              <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                {!todayAttendance?.check_in ? (
                  <Button 
                    type="primary" 
                    onClick={() => checkInMutation.mutate()}
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
                      onClick={() => checkOutMutation.mutate()}
                      loading={checkOutMutation.isPending}
                    >
                      Check Out
                    </Button>
                  </>
                ) : (
                  <Tag color="green">Work day completed</Tag>
                )}
              </Space>
            </Col>
          </Row>

          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <div style={{ textAlign: 'center' }}>
                <Tag color={getStatusColor()}>
                  Status: {getStatusText()}
                </Tag>
              </div>
            </Col>
          </Row>
        </>
      )}
    </StyledCard>
  );
};

export default AttendanceTracker;