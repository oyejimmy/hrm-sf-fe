import React, { useState } from 'react';
import { Calendar, Badge, Card, Space, Tag, Typography, Button } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AttendanceRecord } from '../types';

const { Text } = Typography;

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'On Leave': return 'processing';
      default: return 'default';
    }
  };

  const getAttendanceForDate = (date: Dayjs) => {
    return records.find(record => 
      dayjs(record.date).isSame(date, 'day')
    );
  };

  const dateCellRender = (date: Dayjs) => {
    const attendance = getAttendanceForDate(date);
    
    if (!attendance) return null;

    return (
      <div style={{ minHeight: '60px', padding: '2px' }}>
        <Badge
          status={getStatusColor(attendance.status)}
          text={
            <Text style={{ fontSize: '11px' }}>
              {attendance.status}
            </Text>
          }
        />
        {attendance.checkIn && (
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            In: {new Date(attendance.checkIn).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
        {attendance.checkOut && (
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            Out: {new Date(attendance.checkOut).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    );
  };

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const selectedDateAttendance = getAttendanceForDate(selectedDate);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card
        title="Attendance Calendar"
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
          headerRender={() => null}
        />
      </Card>

      {selectedDateAttendance && (
        <Card title={`Attendance Details - ${selectedDate.format('MMMM D, YYYY')}`}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ 
              padding: 16, 
              border: '1px solid var(--border-color)', 
              borderRadius: 6,
              background: 'var(--surface)'
            }}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space>
                  <Tag color={getStatusColor(selectedDateAttendance.status) === 'success' ? 'green' : 
                              getStatusColor(selectedDateAttendance.status) === 'error' ? 'red' :
                              getStatusColor(selectedDateAttendance.status) === 'warning' ? 'orange' : 'blue'}>
                    {selectedDateAttendance.status}
                  </Tag>
                  {selectedDateAttendance.isManualEntry && (
                    <Tag color="purple">Manual Entry</Tag>
                  )}
                </Space>
                
                <div>
                  <Text strong>Check-in: </Text>
                  <Text>
                    {selectedDateAttendance.checkIn ? 
                      new Date(selectedDateAttendance.checkIn).toLocaleTimeString() : 
                      'Not recorded'
                    }
                  </Text>
                </div>
                
                <div>
                  <Text strong>Check-out: </Text>
                  <Text>
                    {selectedDateAttendance.checkOut ? 
                      new Date(selectedDateAttendance.checkOut).toLocaleTimeString() : 
                      'Not recorded'
                    }
                  </Text>
                </div>
                
                {selectedDateAttendance.breakStart && (
                  <>
                    <div>
                      <Text strong>Break Start: </Text>
                      <Text>{new Date(selectedDateAttendance.breakStart).toLocaleTimeString()}</Text>
                    </div>
                    <div>
                      <Text strong>Break End: </Text>
                      <Text>
                        {selectedDateAttendance.breakEnd ? 
                          new Date(selectedDateAttendance.breakEnd).toLocaleTimeString() : 
                          'Ongoing'
                        }
                      </Text>
                    </div>
                  </>
                )}
                
                <div>
                  <Text strong>Working Hours: </Text>
                  <Text>{selectedDateAttendance.workingHours.toFixed(2)}h</Text>
                </div>
                
                <div>
                  <Text strong>Break Duration: </Text>
                  <Text>{selectedDateAttendance.breakMinutes} minutes</Text>
                </div>
                
                {selectedDateAttendance.notes && (
                  <div>
                    <Text strong>Notes: </Text>
                    <Text>{selectedDateAttendance.notes}</Text>
                  </div>
                )}
              </Space>
            </div>
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default AttendanceCalendar;