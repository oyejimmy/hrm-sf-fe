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
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
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
      render: (record: AttendanceRecord) => (
        <TimeCell>
          <TimeText $type="primary">{formatTime(record.checkIn)}</TimeText>
          {record.status === "Late" && <Tag color="orange">Late</Tag>}
        </TimeCell>
      ),
    },
    {
      title: "Check Out",
      key: "checkOut",
      render: (record: AttendanceRecord) => (
        <TimeText $type="primary">{formatTime(record.checkOut)}</TimeText>
      ),
    },
    {
      title: "Break Time",
      key: "break",
      render: (record: AttendanceRecord) => (
        <TimeCell>
          {record.breakStart && (
            <>
              <TimeText $type="secondary">
                Start: {formatTime(record.breakStart)}
              </TimeText>
              <TimeText $type="secondary">
                End: {formatTime(record.breakEnd)}
              </TimeText>
              <TimeText $type="primary">
                Duration: {record.breakMinutes}min
              </TimeText>
            </>
          )}
        </TimeCell>
      ),
    },
    {
      title: "Working Hours",
      key: "workingHours",
      render: (record: AttendanceRecord) => (
        <Space direction="vertical" size={0}>
          <TimeText $type="primary">
            {formatDuration(record.workingHours)}
          </TimeText>
          <TimeText $type="secondary">
            Total: {formatDuration(record.totalHours)}
          </TimeText>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: AttendanceRecord) => (
        <Space direction="vertical" size={4}>
          <Tag color={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
          {record.isManualEntry && <Tag color="purple">Manual</Tag>}
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
