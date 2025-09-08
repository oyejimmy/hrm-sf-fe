import React from "react";
import { Table, Tag, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Asset } from "../types";

interface AssetTableProps {
  data: Asset[];
  onView: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ data, onView, onReturn }) => {
  const columns: ColumnsType<Asset> = [
    { title: "Asset", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: Asset["status"]) => {
        const color =
          status === "Assigned" ? "blue" :
          status === "Returned" ? "green" :
          status === "Overdue" ? "red" : "orange";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: "Assigned Date", dataIndex: "assignedDate" },
    { title: "Return Date", dataIndex: "returnDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Asset) => (
        <Space>
          <Button size="small" onClick={() => onView(record)}>View</Button>
          <Button size="small" onClick={() => onReturn(record)}>Return</Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default AssetTable;
