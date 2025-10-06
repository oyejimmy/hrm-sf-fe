import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  DatePicker,
  Select,
} from "antd";
import { FilterContainer, TimeCell, TimeText } from "./styles";
import { AttendanceRecord } from "../types";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AttendanceHistoryTable = ({
  records,
  loading = false,
  showEmployeeColumn = false,
}: any) => {
  const [filteredRecords, setFilteredRecords] = useState(records);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "green";
      case "absent":
        return "red";
      case "late":
        return "orange";
      case "on leave":
        return "blue";
      default:
        return "default";
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "-";
    // Handle time-only format (HH:MM:SS) or full datetime
    if (timestamp.includes(':') && !timestamp.includes('T')) {
      // Time only format
      const [hours, minutes] = timestamp.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (duration: any) => {
    if (!duration) return "0h 0m";
    
    // If it's already a formatted string, return it
    if (typeof duration === 'string' && duration.includes('h')) {
      return duration;
    }
    
    // If it's a number (hours)
    if (typeof duration === 'number') {
      const h = Math.floor(duration);
      const m = Math.round((duration - h) * 60);
      return `${h}h ${m}m`;
    }
    
    return "0h 0m";
  };



  const handleFilter = (filters: any) => {
    let filtered = [...records];
    if (filters.status) {
      filtered = filtered.filter((record) => record.status === filters.status);
    }
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }
    setFilteredRecords(filtered);
  };

  const columns: any = [
    ...(showEmployeeColumn
      ? [
          {
            title: "Employee",
            key: "employee",
            render: (record: AttendanceRecord) => (
              <Space direction="vertical" size={0}>
                <span style={{ fontWeight: 500 }}>{record.employeeName}</span>
                <span
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  {record.department}
                </span>
              </Space>
            ),
          },
        ]
      : []),
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Check In",
      key: "checkIn",
      render: (record: any) => (
        <TimeCell>
          <TimeText $type="primary">{formatTime(record.checkIn || record.check_in)}</TimeText>
          {(record.status === "late" || record.status === "Late") && <Tag color="orange">Late</Tag>}
        </TimeCell>
      ),
    },
    {
      title: "Check Out",
      key: "checkOut",
      render: (record: any) => (
        <TimeText $type="primary">{formatTime(record.checkOut || record.check_out)}</TimeText>
      ),
    },

    {
      title: "Working Hours",
      key: "workingHours",
      render: (record: any) => (
        <Space direction="vertical" size={0}>
          <TimeText $type="primary">
            {formatDuration(record.workingHours || record.working_hours || record.hours_worked)}
          </TimeText>
          {(record.totalHours || record.total_hours) && (
            <TimeText $type="secondary">
              Total: {formatDuration(record.totalHours || record.total_hours)}
            </TimeText>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Space direction="vertical" size={4}>
          <Tag color={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
          {(record.isManualEntry || record.is_manual_entry) && <Tag color="purple">Manual</Tag>}
          {record.notes && <Tag color="blue">Note</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <>
      <FilterContainer>
        <RangePicker
          placeholder={["Start Date", "End Date"]}
          onChange={(dates) => handleFilter({ dateRange: dates })}
        />
        <Select
          placeholder="Filter by Status"
          style={{ width: 150 }}
          allowClear
          onChange={(status) => handleFilter({ status })}
        >
          <Option value="present">Present</Option>
          <Option value="absent">Absent</Option>
          <Option value="late">Late</Option>
          <Option value="on leave">On Leave</Option>
        </Select>

      </FilterContainer>

      <Table
        columns={columns}
        dataSource={filteredRecords}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: true }}
      />


    </>
  );
};

export default AttendanceHistoryTable;
