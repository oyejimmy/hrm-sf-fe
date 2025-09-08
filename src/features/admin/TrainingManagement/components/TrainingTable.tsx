import React from "react";
import { Table, Tag, Progress } from "antd";
import { Training } from "../types";
import { ColumnsType } from "antd/es/table";

interface TrainingTableProps {
  data: Training[];
}

const TrainingTable: React.FC<TrainingTableProps> = ({ data }) => {
  const columns: ColumnsType<Training> = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Track", dataIndex: "track", key: "track" },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Training["status"]) => (
        <Tag color={status === "Completed" ? "green" : status === "In Progress" ? "blue" : "red"}>
          {status}
        </Tag>
      ),
    },
    { title: "Deadline", dataIndex: "deadline", key: "deadline" },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default TrainingTable;
