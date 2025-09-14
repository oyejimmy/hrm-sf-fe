import React from 'react';
import { Card, Calendar, Badge } from 'antd';
import { Attendance, LeaveRequest } from '../../types';
import styled from 'styled-components';
import dayjs from 'dayjs';

const StyledCalendar = styled(Calendar)`
  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    font-weight: 600;
  }
  
  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .events .ant-badge-status {
    width: 100%;
    overflow: hidden;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

interface AttendanceCalendarProps {
  attendanceData: Attendance[];
  leaveData: LeaveRequest[];
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceData,
  leaveData
}) => {
  const getListData = (value: any) => {
    const dateStr = value.format('YYYY-MM-DD');
    
    const dayAttendance = attendanceData.filter(item => item.date === dateStr);
    const dayLeaves = leaveData.filter(item => 
      value.isBetween(item.startDate, item.endDate, null, '[]')
    );

    return [
      ...dayAttendance.map(att => ({
        type: att.status === 'Present' ? 'success' : 
              att.status === 'Absent' ? 'error' : 
              att.status === 'Late' ? 'warning' : 'processing',
        content: `${att.employeeName}: ${att.status}`
      })),
      ...dayLeaves.map(leave => ({
        type: leave.status === 'Approved' ? 'success' : 
              leave.status === 'Rejected' ? 'error' : 'warning',
        content: `${leave.employeeName}: ${leave.leaveType}`
      }))
    ];
  };

  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <StyledCalendar dateCellRender={dateCellRender} />
    </Card>
  );
};

export default AttendanceCalendar;