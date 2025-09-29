import React, { useState, useMemo, useCallback } from "react";
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
  Empty,
  Alert,
  Spin,
} from "antd";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  MonthYearSelector,
  DetailCard,
  StatusLegend,
  StatusDot,
  DescriptionPanel,
  CalendarContainer,
  DetailsGrid,
  DetailItem,
} from "./styles";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../../../../services/api/attendanceApi';

const { Text } = Typography;
const { Option } = Select;

// Type definitions
interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: string;
  check_in?: string;
  check_out?: string;
  total_hours: number;
  notes?: string;
}

interface AttendanceCalendarProps {
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
  onNavigate: (direction: "prev" | "next") => void;
}

// Status configuration for reusability
const STATUS_CONFIG: Record<string, StatusConfig> = {
  present: { color: "green", dotColor: "#52c41a" },
  absent: { color: "red", dotColor: "#f5222d" },
  late: { color: "orange", dotColor: "#faad14" },
  on_leave: { color: "blue", dotColor: "#1890ff" },
  half_day: { color: "purple", dotColor: "#722ed1" },
};



// Custom hook for date navigation
const useDateNavigation = (initialDate: Dayjs = dayjs()) => {
  const [viewDate, setViewDate] = useState<Dayjs>(initialDate);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setViewDate((current) =>
      current.add(direction === "prev" ? -1 : 1, "month")
    );
  }, []);

  const setMonth = useCallback((month: number) => {
    setViewDate((current) => current.month(month));
  }, []);

  const setYear = useCallback((year: number) => {
    setViewDate((current) => current.year(year));
  }, []);

  return {
    viewDate,
    navigateMonth,
    setMonth,
    setYear,
  };
};

// Reusable component for date selectors
const DateSelectors: React.FC<DateSelectorsProps> = ({
  viewDate,
  onMonthChange,
  onYearChange,
  onNavigate,
}) => {
  const monthOptions = useMemo(
    (): MonthOption[] =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: dayjs().month(i).format("MMMM"),
      })),
    []
  );

  const yearOptions = useMemo((): YearOption[] => {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => ({
      value: currentYear - 2 + i,
      label: `${currentYear - 2 + i}`,
    }));
  }, []);

  return (
    <MonthYearSelector>
      <Button
        icon={<ChevronLeft size={16} />}
        onClick={() => onNavigate("prev")}
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
        {monthOptions.map((m) => (
          <Option key={m.value} value={m.value}>
            {m.label}
          </Option>
        ))}
      </Select>

      <Select
        value={viewDate.year()}
        onChange={onYearChange}
        style={{ width: 100 }}
        dropdownMatchSelectWidth={false}
        size="small"
      >
        {yearOptions.map((y) => (
          <Option key={y.value} value={y.value}>
            {y.label}
          </Option>
        ))}
      </Select>

      <Button
        icon={<ChevronRight size={16} />}
        onClick={() => onNavigate("next")}
        size="small"
      />
    </MonthYearSelector>
  );
};



// Reusable component for date details
const DateDetails: React.FC<{
  date: Dayjs;
  attendance?: AttendanceRecord;
  isFutureDate: boolean;
  isWeekendDate: boolean;
}> = ({ date, attendance, isFutureDate, isWeekendDate }) => {
  if (isFutureDate) {
    return (
      <Card title={`${date.format("MMM D, YYYY")}`} style={{ marginTop: 12 }}>
        <Empty description="Future date - no attendance record available" />
      </Card>
    );
  }

  if (isWeekendDate) {
    return (
      <Card
        title={`${date.format("MMM D, YYYY")} (Weekend)`}
        style={{ marginTop: 12 }}
      >
        <Empty description="Weekend - no attendance record" />
      </Card>
    );
  }

  if (!attendance) {
    return (
      <Card title={`${date.format("MMM D, YYYY")}`} style={{ marginTop: 12 }}>
        <Empty description="No attendance record for this date" />
      </Card>
    );
  }

  return (
    <DetailCard
      title={`Details - ${date.format("MMM D, YYYY")}`}
      style={{ marginTop: 12 }}
    >
      <DetailsGrid>
        <DetailItem>
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <Tag color={STATUS_CONFIG[attendance.status]?.color || "default"}>
              {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
            </Tag>
          </div>
        </DetailItem>

        {attendance.check_in && (
          <DetailItem>
            <div className="detail-label">Check-in</div>
            <div className="detail-value">
              {attendance.check_in}
            </div>
          </DetailItem>
        )}

        {attendance.check_out && (
          <DetailItem>
            <div className="detail-label">Check-out</div>
            <div className="detail-value">
              {attendance.check_out}
            </div>
          </DetailItem>
        )}

        <DetailItem>
          <div className="detail-label">Working Hours</div>
          <div className="detail-value">
            {attendance.total_hours.toFixed(2)} hours
          </div>
        </DetailItem>

        {attendance.notes && (
          <DetailItem style={{ gridColumn: "1 / -1" }}>
            <div className="detail-label">Notes</div>
            <div className="detail-value">{attendance.notes}</div>
          </DetailItem>
        )}
      </DetailsGrid>
    </DetailCard>
  );
};

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  isDarkMode,
}) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const { viewDate, navigateMonth, setMonth, setYear } = useDateNavigation(today);

  // Fetch attendance data from API
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance-calendar', viewDate.year(), viewDate.month() + 1],
    queryFn: () => attendanceApi.getUserAttendance(viewDate.year(), viewDate.month() + 1),
    retry: 1,
  });

  const records = attendanceData?.records || [];

  const getAttendanceForDate = useCallback(
    (date: Dayjs) => records.find((r: AttendanceRecord) => dayjs(r.date).isSame(date, "day")),
    [records]
  );

  const getCellClassName = useCallback(
    (date: Dayjs) => {
      const classes = [];
      if (date.day() === 0 || date.day() === 6) classes.push("weekend-cell");
      if (date.isAfter(today, "day")) classes.push("future-cell");
      if (date.isSame(today, "day")) classes.push("today-cell");
      return classes.join(" ");
    },
    [today]
  );

  const dateCellRender = useCallback(
    (date: Dayjs) => {
      const attendance = getAttendanceForDate(date);
      return (
        <div
          className={`attendance-cell ${getCellClassName(date)}`}
          style={{
            border: date.isSame(selectedDate, "day")
              ? "2px solid #1890ff"
              : "none",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {attendance && <StatusDot status={attendance.status} />}
        </div>
      );
    },
    [getAttendanceForDate, getCellClassName, selectedDate]
  );

  const onDateSelect = useCallback(
    (date: Dayjs) => {
      if (date.month() === viewDate.month() && !date.isAfter(today, "day")) {
        setSelectedDate(date);
      }
    },
    [viewDate, today]
  );

  const selectedDateAttendance = getAttendanceForDate(selectedDate);
  const isFutureDate = selectedDate.isAfter(today, "day");
  const isWeekendDate = selectedDate.day() === 0 || selectedDate.day() === 6;

  return (
    <>
      <DescriptionPanel>
        <Alert
          message="Attendance Calendar"
          description="View your attendance records with color-coded status indicators. Click on any date to see details."
          type="info"
          showIcon
          style={{ marginBottom: 12 }}
        />
        <StatusLegend>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <Tag key={status} color={config.color}>
              {status}
            </Tag>
          ))}
        </StatusLegend>
      </DescriptionPanel>

      <Row gutter={[12, 12]}>
        <Col xs={24}>
          <CalendarContainer>
            <Spin spinning={isLoading}>
              <Calendar
                value={viewDate}
                onSelect={onDateSelect}
                dateCellRender={dateCellRender}
                fullscreen={false}
                disabledDate={(current) =>
                  current && current > today.endOf("day")
                }
                headerRender={() => (
                  <DateSelectors
                    viewDate={viewDate}
                    onMonthChange={setMonth}
                    onYearChange={setYear}
                    onNavigate={navigateMonth}
                  />
                )}
              />
            </Spin>
          </CalendarContainer>
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
