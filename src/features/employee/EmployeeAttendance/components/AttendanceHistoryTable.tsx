import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  DatePicker,
  Select,
  Input,
  Modal,
  Form,
  message,
} from "antd";
import { Download } from "lucide-react";
import { FilterContainer, TimeCell, TimeText } from "./styles";
import { AttendanceRecord, AttendanceOverride } from "../types";
import { attendanceApi } from "../../../../services/api/attendanceApi";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const AttendanceHistoryTable = ({
  records,
  loading = false,
  showEmployeeColumn = false,
  onRecordUpdate,
}: any) => {
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    record?: AttendanceRecord;
  }>({ visible: false });
  const [form] = Form.useForm();

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

  const handleEditSubmit = async (values: any) => {
    if (!editModal.record) return;

    try {
      const override: AttendanceOverride = {
        attendanceId: editModal.record.id,
        field: "checkIn", // This would be dynamic based on what changed
        oldValue: editModal.record.checkIn || "",
        newValue: values.checkIn,
        reason: values.reason || "Manual correction",
        overriddenBy: "Current User",
        overriddenAt: new Date().toISOString(),
      };

      await attendanceApi.overrideAttendance(override);
      message.success("Attendance record updated successfully");
      setEditModal({ visible: false });
      form.resetFields();

      if (onRecordUpdate) {
        onRecordUpdate({ ...editModal.record, ...values });
      }
    } catch (error) {
      message.error("Failed to update attendance record");
    }
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

  const handleExport = async () => {
    try {
      const blob = await attendanceApi.exportAttendanceReport({
        records: filteredRecords.map((r: any) => r.id),
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const sanitizedDate = new Date()
        .toISOString()
        .split("T")[0]
        .replace(/[^\w\-]/g, "");
      a.download = `attendance-report-${sanitizedDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success("Report exported successfully");
    } catch (error) {
      message.error("Failed to export report");
    }
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
        <Button icon={<Download size={16} />} onClick={handleExport}>
          Export
        </Button>
      </FilterContainer>

      <Table
        columns={columns}
        dataSource={filteredRecords}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: true }}
      />

      <Modal
        title="Edit Attendance Record"
        open={editModal.visible}
        onCancel={() => setEditModal({ visible: false })}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item label="Check In Time" name="checkIn">
              <Input type="time" />
            </Form.Item>
            <Form.Item label="Check Out Time" name="checkOut">
              <Input type="time" />
            </Form.Item>
            <Form.Item label="Break Start" name="breakStart">
              <Input type="time" />
            </Form.Item>
            <Form.Item label="Break End" name="breakEnd">
              <Input type="time" />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Option value="present">Present</Option>
                <Option value="absent">Absent</Option>
                <Option value="late">Late</Option>
                <Option value="on leave">On Leave</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Reason for Change"
              name="reason"
              rules={[{ required: true }]}
            >
              <TextArea
                rows={3}
                placeholder="Explain why this change is being made"
              />
            </Form.Item>
            <Form.Item label="Notes" name="notes">
              <TextArea rows={2} />
            </Form.Item>
          </Space>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit">
              Update Record
            </Button>
            <Button onClick={() => setEditModal({ visible: false })}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AttendanceHistoryTable;
