import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Space, Tag, Modal, Calendar, Badge } from 'antd';
import { Clock, CheckCircle, XCircle, Coffee } from 'lucide-react';
import styled from 'styled-components';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { Dayjs } from 'dayjs';

const { Text, Title } = Typography;

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
  const [checkedIn, setCheckedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  const handleCheckIn = () => {
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setOnBreak(false);
  };

  const handleBreak = () => {
    setOnBreak(!onBreak);
  };

  const getListData = (value: Dayjs) => {
    const day = value.date();
    const listData = [];
    
    if (day % 3 === 0) {
      listData.push({ type: 'success', content: 'Present' });
    } else if (day % 7 === 0) {
      listData.push({ type: 'error', content: 'Absent' });
    } else if (day % 5 === 0) {
      listData.push({ type: 'warning', content: 'Late' });
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
                  {checkedIn ? '09:00 AM' : 'Not checked in'}
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
                  {onBreak ? '30 min' : 'Available'}
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
                  Expected: 06:00 PM
                </div>
              </div>
            </TimeCard>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              {!checkedIn ? (
                <Button type="primary" onClick={handleCheckIn}>
                  Check In
                </Button>
              ) : (
                <>
                  <Button 
                    type={onBreak ? "default" : "primary"} 
                    onClick={handleBreak}
                  >
                    {onBreak ? 'End Break' : 'Take Break'}
                  </Button>
                  <Button type="primary" danger onClick={handleCheckOut}>
                    Check Out
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <div style={{ textAlign: 'center' }}>
              <Tag color={checkedIn ? 'green' : 'orange'}>
                Status: {checkedIn ? (onBreak ? 'On Break' : 'Working') : 'Not Checked In'}
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