import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Calendar, Badge, Modal, Input, Spin, Alert } from 'antd';
import { Clock, Play, Square, Coffee, User } from 'lucide-react';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { StateCard } from '../../../components/StateCard';
import { useTodayAttendance, useMyAttendance, useCheckIn, useCheckOut } from '../../../hooks/api/useAttendance';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AttendanceTracker: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [checkInNotes, setCheckInNotes] = useState('');
  const [checkOutNotes, setCheckOutNotes] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  // API Hooks
  const { data: todayAttendance, isLoading: todayLoading, error: todayError } = useTodayAttendance();
  const { data: myAttendanceData, isLoading: historyLoading, error: historyError } = useMyAttendance({
    year: dayjs().year(),
    month: dayjs().month() + 1
  });
  
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Extract records from API response
  const myAttendance = myAttendanceData || [];

  const handleCheckIn = () => {
    checkInMutation.mutate(undefined, {
      onSuccess: () => {
        setShowCheckInModal(false);
        setCheckInNotes('');
      }
    });
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowCheckOutModal(false);
        setCheckOutNotes('');
      }
    });
  };

  const getCalendarData = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const record = myAttendance.find((r: any) => r.date === dateStr);
    
    if (!record) return null;
    
    const statusConfig = {
      present: { type: 'success', text: 'Present' },
      late: { type: 'warning', text: 'Late' },
      absent: { type: 'error', text: 'Absent' },
      half_day: { type: 'processing', text: 'Half Day' },
      on_leave: { type: 'processing', text: 'On Leave' },
    };
    
    const config = statusConfig[record.status as keyof typeof statusConfig];
    return config ? { type: config.type, content: config.text } : null;
  };

  const monthlyStats = React.useMemo(() => {
    if (!Array.isArray(myAttendance)) {
      return {
        present: 0,
        late: 0,
        absent: 0,
        totalHours: 0,
      };
    }

    const currentMonth = dayjs().format('YYYY-MM');
    const monthRecords = myAttendance.filter((r: any) => r.date && r.date.startsWith(currentMonth));
    
    return {
      present: monthRecords.filter((r: any) => r.status === 'present').length,
      late: monthRecords.filter((r: any) => r.status === 'late').length,
      absent: monthRecords.filter((r: any) => r.status === 'absent').length,
      totalHours: monthRecords.reduce((sum: number, r: any) => sum + (r.total_hours || 0), 0),
    };
  }, [myAttendance]);

  const isCheckedIn = todayAttendance?.check_in && !todayAttendance?.check_out;
  const isCheckedOut = todayAttendance?.check_in && todayAttendance?.check_out;
  const hasError = todayError || historyError;
  const isLoading = todayLoading || historyLoading;

  // Show error state if there's an error
  if (hasError) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <HeaderComponent
          isDarkMode={isDarkMode}
          title="My Attendance"
          subtitle="Track your daily attendance and view your history"
          breadcrumbItems={[
            { title: "Home", href: "/" },
            { title: "My Attendance" },
          ]}
        />
        <Alert
          message="Error Loading Attendance Data"
          description="There was an issue loading your attendance information. Please try refreshing the page."
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="My Attendance"
        subtitle="Track your daily attendance and view your history"
        breadcrumbItems={[
          { title: "Home", href: "/" },
          { title: "My Attendance" },
        ]}
      />

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading attendance data...</div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Present Days"
            value={monthlyStats.present}
            icon={<User />}
            tone="pastelGreen"
            loading={historyLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Late Days"
            value={monthlyStats.late}
            icon={<Clock />}
            tone="softLavender"
            loading={historyLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Absent Days"
            value={monthlyStats.absent}
            icon={<User />}
            tone="lightPeach"
            loading={historyLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StateCard
            label="Total Hours"
            value={`${monthlyStats.totalHours.toFixed(1)}h`}
            icon={<Clock />}
            tone="pastelBlue"
            loading={historyLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Today's Attendance" loading={todayLoading}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Date: </Text>
                <Text>{dayjs().format('DD MMMM YYYY')}</Text>
              </div>
              
              {todayAttendance?.check_in && (
                <div>
                  <Text strong>Check In: </Text>
                  <Text>{dayjs(todayAttendance.check_in).format('HH:mm')}</Text>
                </div>
              )}
              
              {todayAttendance?.check_out && (
                <div>
                  <Text strong>Check Out: </Text>
                  <Text>{dayjs(todayAttendance.check_out).format('HH:mm')}</Text>
                </div>
              )}
              
              {todayAttendance?.total_hours && (
                <div>
                  <Text strong>Hours Worked: </Text>
                  <Text>{todayAttendance.total_hours.toFixed(1)} hours</Text>
                </div>
              )}

              <Space>
                {!todayAttendance?.check_in && (
                  <Button
                    type="primary"
                    icon={<Play size={16} />}
                    onClick={() => setShowCheckInModal(true)}
                    loading={checkInMutation.isPending}
                  >
                    Check In
                  </Button>
                )}
                
                {isCheckedIn && (
                  <Button
                    danger
                    icon={<Square size={16} />}
                    onClick={() => setShowCheckOutModal(true)}
                    loading={checkOutMutation.isPending}
                  >
                    Check Out
                  </Button>
                )}
                
                {isCheckedOut && (
                  <Text type="success">✓ Day completed</Text>
                )}
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Attendance Calendar" loading={historyLoading}>
            <Calendar
              fullscreen={false}
              dateCellRender={(value) => {
                const data = getCalendarData(value);
                return data ? <Badge status={data.type as any} text={data.content} /> : null;
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Check In"
        open={showCheckInModal}
        onOk={handleCheckIn}
        onCancel={() => setShowCheckInModal(false)}
        confirmLoading={checkInMutation.isPending}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Current time: {dayjs().format('HH:mm')}</Text>
          <TextArea
            placeholder="Add notes (optional)"
            value={checkInNotes}
            onChange={(e) => setCheckInNotes(e.target.value)}
            rows={3}
          />
        </Space>
      </Modal>

      <Modal
        title="Check Out"
        open={showCheckOutModal}
        onOk={handleCheckOut}
        onCancel={() => setShowCheckOutModal(false)}
        confirmLoading={checkOutMutation.isPending}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Current time: {dayjs().format('HH:mm')}</Text>
          <TextArea
            placeholder="Add notes (optional)"
            value={checkOutNotes}
            onChange={(e) => setCheckOutNotes(e.target.value)}
            rows={3}
          />
        </Space>
      </Modal>
        </>
      )}
    </Wrapper>
  );
};

export default AttendanceTracker;