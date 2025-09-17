import React, { useState } from 'react';
import { Calendar, Badge, Card, Space, Tag, Typography, Button } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { LeaveRequest } from '../types';

dayjs.extend(isBetween);

const { Text } = Typography;

interface LeaveCalendarProps {
  requests: LeaveRequest[];
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ requests }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Annual': return 'orange';
      case 'Sick': return 'red';
      case 'Casual': return 'green';
      case 'Half Day': return 'blue';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'On Hold': return 'warning';
      case 'Pending': return 'processing';
      default: return 'default';
    }
  };

  const getLeaveEventsForDate = (date: Dayjs) => {
    return requests.filter(request => {
      const fromDate = dayjs(request.from);
      const toDate = dayjs(request.to);
      return date.isBetween(fromDate, toDate, 'day', '[]');
    });
  };

  const dateCellRender = (date: Dayjs) => {
    const events = getLeaveEventsForDate(date);
    
    return (
      <div style={{ minHeight: '60px' }}>
        {events.map(event => (
          <div key={event.id} style={{ marginBottom: 2 }}>
            <Badge
              status={getStatusColor(event.status)}
              text={
                <Text style={{ fontSize: '11px' }}>
                  {event.type}
                </Text>
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const monthCellRender = (date: Dayjs) => {
    const monthEvents = requests.filter(request => {
      const fromDate = dayjs(request.from);
      return fromDate.isSame(date, 'month');
    });

    return monthEvents.length > 0 ? (
      <div>
        <Text style={{ fontSize: '12px' }}>
          {monthEvents.length} request{monthEvents.length !== 1 ? 's' : ''}
        </Text>
      </div>
    ) : null;
  };

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const selectedDateEvents = getLeaveEventsForDate(selectedDate);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card
        title="Leave Calendar"
        extra={
          <Space>
            <Button 
              icon={<ChevronLeft size={16} />} 
              onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
            />
            <Text strong>{selectedDate.format('MMMM YYYY')}</Text>
            <Button 
              icon={<ChevronRight size={16} />} 
              onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}
            />
          </Space>
        }
      >
        <Calendar
          value={selectedDate}
          onSelect={onDateSelect}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          headerRender={() => null}
        />
      </Card>

      {selectedDateEvents.length > 0 && (
        <Card title={`Leave Details - ${selectedDate.format('MMMM D, YYYY')}`}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {selectedDateEvents.map(event => (
              <div key={event.id} style={{ 
                padding: 12, 
                border: '1px solid var(--border-color)', 
                borderRadius: 6,
                background: 'var(--surface)'
              }}>
                <Space direction="vertical" size={4}>
                  <Space>
                    <Tag color={getLeaveColor(event.type)}>{event.type}</Tag>
                    <Badge status={getStatusColor(event.status)} text={event.status} />
                  </Space>
                  <Text strong>{event.employeeName}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {event.durationType} • {event.duration} day{event.duration !== 1 ? 's' : ''}
                  </Text>
                  <Text style={{ fontSize: '12px' }}>{event.reason}</Text>
                </Space>
              </div>
            ))}
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default LeaveCalendar;