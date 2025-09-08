import React from "react";
import { Table, Tag, Tooltip, Space, Modal } from "antd";
import { EyeOutlined, DownloadOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Document } from "../types";

const TableWrapper = styled.div`
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

interface Props {
  documents: Document[];
  onView: (doc: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentsTable: React.FC<Props> = ({ documents, onView, onDelete }) => {
  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this document?",
      icon: <ExclamationCircleOutlined />,
      onOk: () => onDelete(id),
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (status: string) => {
        let color = status === "verified" ? "green" : status === "expired" ? "red" : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    { title: "Uploaded On", dataIndex: "uploadDate", key: "uploadDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Document) => (
        <Space>
          <Tooltip title="View"><EyeOutlined onClick={() => onView(record)} style={{ cursor: "pointer" }} /></Tooltip>
          <Tooltip title="Download"><a href={record.fileUrl} download><DownloadOutlined /></a></Tooltip>
          <Tooltip title="Delete"><DeleteOutlined onClick={() => confirmDelete(record.id)} style={{ cursor: "pointer", color: "red" }} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <TableWrapper>
      <Table rowKey="id" dataSource={documents} columns={columns} pagination={{ pageSize: 5 }} />
    </TableWrapper>
  );
};

export default DocumentsTable;
