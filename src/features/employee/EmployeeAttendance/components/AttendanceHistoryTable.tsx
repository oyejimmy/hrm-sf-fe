import React from "react";
import styled from "styled-components";
import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AttendanceRecord } from "../types";

const Wrapper = styled(Card)`
  border-radius: 12px;
  .ant-card-body { padding: 12px; }
`;

/** Props */
interface Props {
  records: AttendanceRecord[];
  loading?: boolean;
}

const AttendanceHistoryTable: React.FC<Props> = ({ records, loading }) => {
  const columns: ColumnsType<AttendanceRecord> = [
    { title: "Date", dataIndex: "date", key: "date", width: 130 },
    { title: "Check-in", dataIndex: "checkIn", key: "checkIn", width: 120 },
    { title: "Check-out", dataIndex: "checkOut", key: "checkOut", width: 120 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: AttendanceRecord["status"]) => {
        const color = status === "Present" ? "green" : status === "Late" ? "orange" : status === "On Leave" ? "blue" : "red";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: "Hours Worked", dataIndex: "totalHours", key: "totalHours", width: 120, render: (v) => v != null ? `${v} hrs` : "—" }
  ];

  return (
    <Wrapper title="Attendance History">
      <Table<AttendanceRecord>
        columns={columns}
        dataSource={records}
        rowKey="id"
        size="small"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 700 }}
      />
    </Wrapper>
  );
};

export default AttendanceHistoryTable;
