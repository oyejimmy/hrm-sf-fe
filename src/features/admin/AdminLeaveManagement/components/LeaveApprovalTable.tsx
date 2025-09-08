import React from "react";
import { Table, Button, Tag, Space } from "antd";
import { LeaveRequest } from "../types";

interface Props {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LeaveApprovalTable: React.FC<Props> = ({ requests, onApprove, onReject }) => {
  const columns = [
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "From", dataIndex: "fromDate", key: "fromDate" },
    { title: "To", dataIndex: "toDate", key: "toDate" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Approved" ? "green" : status === "Rejected" ? "red" : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: LeaveRequest) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => onApprove(record.id)}
            disabled={record.status !== "Pending"}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={() => onReject(record.id)}
            disabled={record.status !== "Pending"}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return <Table rowKey="id" dataSource={requests} columns={columns} />;
};

export default LeaveApprovalTable;
