import React from "react";
import { Table, Tag } from "antd";
import { LeaveRequest } from "../types";

interface Props {
  data: LeaveRequest[];
}

const LeaveHistoryTable: React.FC<Props> = ({ data }) => {
  const columns = [
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
  ];

  return <Table rowKey="id" dataSource={data} columns={columns} />;
};

export default LeaveHistoryTable;
