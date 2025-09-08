import React from "react";
import { Table, Tag, Space, Button } from "antd";
import { Report } from "../types";
import { ColumnsType } from "antd/es/table";

interface ReportsTableProps {
  reports: Report[];
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onDelete: (report: Report) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onView, onDownload, onDelete }) => {
  const columns: ColumnsType<Report> = [
    { title: "Report Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Created On", dataIndex: "createdOn", key: "createdOn" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Report["status"]) => (
        <Tag color={status === "Draft" ? "orange" : status === "Finalized" ? "blue" : "green"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onView(record)}>View</Button>
          <Button type="link" onClick={() => onDownload(record)}>Download</Button>
          <Button type="link" danger onClick={() => onDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={reports} />;
};

export default ReportsTable;
