import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Card,
  Space,
  Tag,
  Typography,
  Button,
  Select,
  Row,
  Col,
  Divider,
  Empty,
  Alert,
  Statistic
} from 'antd';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  UserCheck,
  UserX,
  AlertCircle,
  Coffee
} from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import styled from 'styled-components';
import { Wrapper } from '../../../../components/Wrapper';

dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(localeData);

const { Text } = Typography;
const { Option } = Select;

// Type definitions
interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day' | 'Weekend' | 'Holiday';
  checkIn?: string;
  checkOut?: string;
  workingHours: number;
  breakMinutes: number;
  isManualEntry: boolean;
  notes?: string;
}

interface AttendanceCalendarProps {
  records?: AttendanceRecord[];
  isDarkMode?: boolean;
}

interface StatusConfig {
  color: string;
  dotColor: string;
}

interface MonthOption {
  value: number;
  label: string;
}

interface YearOption {
  value: number;
  label: string;
}

interface DateSelectorsProps {
  viewDate: Dayjs;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

interface AttendanceStatsProps {
  records: AttendanceRecord[];
}

interface DateDetailsProps {
  date: Dayjs;
  attendance?: AttendanceRecord;
  isFutureDate: boolean;
  isWeekendDate: boolean;
}

interface StatItemProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

// Status configuration for reusability
const STATUS_CONFIG: Record<string, StatusConfig> = {
  Present: { color: 'green', dotColor: '#52c41a' },
  Absent: { color: 'red', dotColor: '#f5222d' },
  Late: { color: 'orange', dotColor: '#faad14' },
  'On Leave': { color: 'blue', dotColor: '#1890ff' },
  'Half Day': { color: 'purple', dotColor: '#722ed1' },
  Weekend: { color: 'default', dotColor: '#8c8c8c' },
  Holiday: { color: 'magenta', dotColor: '#eb2f96' }
};

// Styled components
const MonthYearSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  background: transparent;
  
  @media (max-width: 576px) {
    gap: 6px;
  }
`;

const DetailCard = styled(Card)`
  .ant-card-head {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    padding: 12px;
  }
  
  .ant-card-body {
    padding: 12px;
  }
`;

const StatsCard = styled(Card)`
  height: 100%;
  
  .ant-card-body {
    padding: 12px;
  }
`;

const StatusLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
  justify-content: center;
  
  @media (max-width: 576px) {
    gap: 4px;
    
    .ant-tag {
      font-size: 11px;
      padding: 2px 6px;
      margin: 2px;
    }
  }
`;

const StatusDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ status }) =>
    STATUS_CONFIG[status]?.dotColor || '#d9d9d9'};
`;

const DescriptionPanel = styled.div`
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const CalendarContainer = styled.div`
  .ant-picker-calendar {
    .ant-picker-panel {
      padding: 8px;
      
      .ant-picker-cell {
        padding: 2px;
        
        .ant-picker-cell-inner {
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 6px;
  background-color: #f9f9f9;
  
  .detail-label {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 12px;
    color: #666;
  }
  
  .detail-value {
    font-size: 14px;
  }
`;

// Custom hook for attendance data
const useAttendanceData = (propRecords?: AttendanceRecord[]) => {
  const today = dayjs();

  const generateDummyData = useCallback((): AttendanceRecord[] => {
    const data: AttendanceRecord[] = [];
    const startOfMonth = today.startOf('month');
    const daysInMonth = today.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const date = startOfMonth.add(i, 'day');
      const dayOfWeek = date.day();

      if (date.isAfter(today, 'day')) continue;

      const baseRecord = {
        id: `record-${i}`,
        employeeId: 'emp1',
        date: date.toISOString(),
        workingHours: 0,
        breakMinutes: 0,
        isManualEntry: false
      };

      // Weekend
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        data.push({ ...baseRecord, status: 'Weekend', notes: 'Weekend' });
        continue;
      }

      // Holiday
      if (i % 7 === 0 && i > 0) {
        data.push({ ...baseRecord, status: 'Holiday', notes: 'Public Holiday' });
        continue;
      }

      // Regular days with different statuses
      const random = Math.random();
      let status: AttendanceRecord['status'] = 'Present';
      let checkIn: any = date.hour(9).minute(Math.floor(Math.random() * 30)).toISOString();
      let checkOut: any = date.hour(17).minute(Math.floor(Math.random() * 30)).toISOString();
      let notes: string | undefined;

      if (random < 0.12) {
        status = 'Absent';
        checkIn = undefined;
        checkOut = undefined;
        notes = 'Sick leave';
      } else if (random < 0.22) {
        status = 'Late';
        checkIn = date.hour(10).minute(Math.floor(Math.random() * 59)).toISOString();
        notes = 'Traffic delay';
      } else if (random < 0.30) {
        status = 'On Leave';
        checkIn = undefined;
        checkOut = undefined;
        notes = 'Annual leave';
      } else if (random < 0.35) {
        status = 'Half Day';
        checkOut = date.hour(13).minute(0).toISOString();
        notes = 'Doctor appointment';
      }

      data.push({
        ...baseRecord,
        status,
        checkIn,
        checkOut,
        workingHours: status === 'Half Day' ? 4 : ['Present', 'Late'].includes(status) ? 8 : 0,
        breakMinutes: ['Present', 'Late'].includes(status) ? 60 : 0,
        isManualEntry: ['Absent', 'On Leave'].includes(status),
        notes
      });
    }

    return data;
  }, [today]);

  const records = useMemo(() =>
    (propRecords?.length ? propRecords : generateDummyData()),
    [propRecords, generateDummyData]
  );

  return records;
};

// Custom hook for date navigation
const useDateNavigation = (initialDate: Dayjs = dayjs()) => {
  const [viewDate, setViewDate] = useState<Dayjs>(initialDate);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setViewDate(current => current.add(direction === 'prev' ? -1 : 1, 'month'));
  }, []);

  const setMonth = useCallback((month: number) => {
    setViewDate(current => current.month(month));
  }, []);

  const setYear = useCallback((year: number) => {
    setViewDate(current => current.year(year));
  }, []);

  return {
    viewDate,
    navigateMonth,
    setMonth,
    setYear
  };
};

// Reusable component for date selectors
const DateSelectors: React.FC<DateSelectorsProps> = ({
  viewDate,
  onMonthChange,
  onYearChange,
  onNavigate
}) => {
  const monthOptions = useMemo((): MonthOption[] =>
    Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: dayjs().month(i).format('MMMM')
    })), []);

  const yearOptions = useMemo((): YearOption[] => {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => ({
      value: currentYear - 2 + i,
      label: `${currentYear - 2 + i}`
    }));
  }, []);

  return (
    <MonthYearSelector>
      <Button
        icon={<ChevronLeft size={16} />}
        onClick={() => onNavigate('prev')}
        size="small"
      />

      <Select
        value={viewDate.month()}
        onChange={onMonthChange}
        style={{ width: 120 }}
        suffixIcon={<CalendarIcon size={14} />}
        dropdownMatchSelectWidth={false}
        size="small"
      >
        {monthOptions.map(m => (
          <Option key={m.value} value={m.value}>{m.label}</Option>
        ))}
      </Select>

      <Select
        value={viewDate.year()}
        onChange={onYearChange}
        style={{ width: 100 }}
        dropdownMatchSelectWidth={false}
        size="small"
      >
        {yearOptions.map(y => (
          <Option key={y.value} value={y.value}>{y.label}</Option>
        ))}
      </Select>

      <Button
        icon={<ChevronRight size={16} />}
        onClick={() => onNavigate('next')}
        size="small"
      />
    </MonthYearSelector>
  );
};

// StatItem component
const StatItem: React.FC<StatItemProps> = ({ title, value, icon, color }) => (
  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
    <StatsCard>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color, fontSize: '18px' }}
        style={{ textAlign: 'center' }}
      />
    </StatsCard>
  </Col>
);

// Reusable component for attendance statistics
const AttendanceStats: React.FC<AttendanceStatsProps> = ({ records }) => {
  const stats = useMemo(() => {
    const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, status) => {
      acc[status] = records.filter(r => r.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    const workingDays = records.filter(r =>
      ['Present', 'Late', 'Half Day'].includes(r.status)
    ).length;

    return {
      ...statusCounts,
      workingDays,
      total: records.length
    };
  }, [records]);

  return (
    <Card title="Attendance Summary" bordered={false} style={{ marginBottom: '12px' }}>
      <Row gutter={[8, 8]}>
        <StatItem
          title="Present"
          value={(stats as Record<string, number>).Present || 0}
          icon={<UserCheck size={16} style={{ color: '#52c41a' }} />}
          color="#52c41a"
        />
        <StatItem
          title="Absent"
          value={(stats as Record<string, number>).Absent || 0}
          icon={<UserX size={16} style={{ color: '#f5222d' }} />}
          color="#f5222d"
        />
        <StatItem
          title="Late"
          value={(stats as Record<string, number>).Late || 0}
          icon={<AlertCircle size={16} style={{ color: '#faad14' }} />}
          color="#faad14"
        />
        <StatItem
          title="On Leave"
          value={(stats as Record<string, number>)['On Leave'] || 0}
          icon={<Coffee size={16} style={{ color: '#1890ff' }} />}
          color="#1890ff"
        />
      </Row>
      <Divider style={{ margin: '12px 0' }} />
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text strong>Working Days: {stats.workingDays}</Text>
        <Text strong>Total Recorded: {stats.total} days</Text>
      </Space>
    </Card>
  );
};

// Reusable component for date details
const DateDetails: React.FC<DateDetailsProps> = ({
  date,
  attendance,
  isFutureDate,
  isWeekendDate
}) => {
  if (isFutureDate) {
    return (
      <Card title={`${date.format('MMM D, YYYY')}`} style={{ marginTop: '12px' }}>
        <Empty description="Future date - no attendance record available" />
      </Card>
    );
  }

  if (isWeekendDate) {
    return (
      <Card title={`${date.format('MMM D, YYYY')} (Weekend)`} style={{ marginTop: '12px' }}>
        <Empty description="Weekend - no attendance record" />
      </Card>
    );
  }

  if (!attendance) {
    return (
      <Card title={`${date.format('MMM D, YYYY')}`} style={{ marginTop: '12px' }}>
        <Empty description="No attendance record for this date" />
      </Card>
    );
  }

  return (
    <DetailCard title={`Details - ${date.format('MMM D, YYYY')}`} style={{ marginTop: '12px' }}>
      <DetailsGrid>
        <DetailItem>
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <Tag color={STATUS_CONFIG[attendance.status]?.color || 'default'}>
              {attendance.status}
            </Tag>
            {attendance.isManualEntry && <Tag color="purple" style={{ marginLeft: '4px' }}>Manual Entry</Tag>}
          </div>
        </DetailItem>

        {attendance.checkIn && (
          <DetailItem>
            <div className="detail-label">Check-in</div>
            <div className="detail-value">
              {dayjs(attendance.checkIn).format('HH:mm:ss')}
            </div>
          </DetailItem>
        )}

        {attendance.checkOut && (
          <DetailItem>
            <div className="detail-label">Check-out</div>
            <div className="detail-value">
              {dayjs(attendance.checkOut).format('HH:mm:ss')}
            </div>
          </DetailItem>
        )}

        <DetailItem>
          <div className="detail-label">Working Hours</div>
          <div className="detail-value">
            {attendance.workingHours.toFixed(2)} hours
          </div>
        </DetailItem>

        <DetailItem>
          <div className="detail-label">Break Duration</div>
          <div className="detail-value">
            {attendance.breakMinutes} minutes
          </div>
        </DetailItem>

        {attendance.notes && (
          <DetailItem style={{ gridColumn: '1 / -1' }}>
            <div className="detail-label">Notes</div>
            <div className="detail-value">
              {attendance.notes}
            </div>
          </DetailItem>
        )}
      </DetailsGrid>
    </DetailCard>
  );
};

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  isDarkMode,
  records: propRecords
}) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  const records = useAttendanceData(propRecords);
  const { viewDate, navigateMonth, setMonth, setYear } = useDateNavigation(today);

  const getAttendanceForDate = useCallback((date: Dayjs) =>
    records.find(r => dayjs(r.date).isSame(date, 'day')),
    [records]
  );

  const getCellClassName = useCallback((date: Dayjs) => {
    const classes = [];
    if (date.day() === 0 || date.day() === 6) classes.push('weekend-cell');
    if (date.isAfter(today, 'day')) classes.push('future-cell');
    if (date.isSame(today, 'day')) classes.push('today-cell');
    return classes.join(' ');
  }, [today]);

  const dateCellRender = useCallback((date: Dayjs) => {
    const attendance = getAttendanceForDate(date);
    return (
      <div
        className={`attendance-cell ${getCellClassName(date)}`}
        style={{
          border: date.isSame(selectedDate, 'day') ? '2px solid #1890ff' : 'none',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {attendance && <StatusDot status={attendance.status} />}
      </div>
    );
  }, [getAttendanceForDate, getCellClassName, selectedDate]);

  const onDateSelect = useCallback((date: Dayjs) => {
    if (date.month() === viewDate.month() && !date.isAfter(today, 'day')) {
      setSelectedDate(date);
    }
  }, [viewDate, today]);

  const selectedDateAttendance = getAttendanceForDate(selectedDate);
  const isFutureDate = selectedDate.isAfter(today, 'day');
  const isWeekendDate = selectedDate.day() === 0 || selectedDate.day() === 6;

  return (
    <>
      <DescriptionPanel>
        <Alert
          message="Attendance Calendar"
          description="View your attendance records with color-coded status indicators. Click on any date to see details."
          type="info"
          showIcon
          style={{ marginBottom: '12px' }}
        />
        <StatusLegend>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <Tag key={status} color={config.color}>{status}</Tag>
          ))}
        </StatusLegend>
      </DescriptionPanel>

      <Row gutter={[12, 12]}>
        <Col xs={24} lg={16}>
          <CalendarContainer>
            <Calendar
              value={viewDate}
              onSelect={onDateSelect}
              dateCellRender={dateCellRender}
              fullscreen={false}
              disabledDate={(current) => current && current > today.endOf('day')}
              headerRender={() => (
                <DateSelectors
                  viewDate={viewDate}
                  onMonthChange={setMonth}
                  onYearChange={setYear}
                  onNavigate={navigateMonth}
                />
              )}
            />
          </CalendarContainer>
        </Col>

        <Col xs={24} lg={8}>
          <AttendanceStats records={records} />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <DateDetails
            date={selectedDate}
            attendance={selectedDateAttendance}
            isFutureDate={isFutureDate}
            isWeekendDate={isWeekendDate}
          />
        </Col>
      </Row>
    </>
  );
};

export default AttendanceCalendar;