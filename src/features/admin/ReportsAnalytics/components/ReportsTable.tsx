import React from "react";
import { Table, Tag, Space, Button } from "antd";
import { Report } from "../types";
import { ColumnsType } from "antd/es/table";
import { 
  EyeOutlined, 
  DownloadOutlined, 
  DeleteOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined
} from "@ant-design/icons";

interface ReportsTableProps {
  reports: Report[];
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onDelete: (report: Report) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onView, onDownload, onDelete }) => {
  const typeColors = {
    Performance: "blue",
    Recruitment: "green",
    Attendance: "orange",
    Custom: "purple"
  };

  const columns: ColumnsType<Report> = [
    { 
      title: "Report Name", 
      dataIndex: "name", 
      key: "name",
      render: (name: string) => (
        <span>
          <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {name}
        </span>
      )
    },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      render: (type: Report["type"]) => (
        <Tag color={typeColors[type]}>
          {type}
        </Tag>
      )
    },
    { 
      title: "Created By", 
      dataIndex: "createdBy", 
      key: "createdBy",
      render: (createdBy: string) => (
        <span>
          <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          {createdBy}
        </span>
      )
    },
    { 
      title: "Created On", 
      dataIndex: "createdOn", 
      key: "createdOn",
      render: (createdOn: string) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
          {new Date(createdOn).toLocaleDateString()}
        </span>
      )
    },
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
          <Button 
            type="link" 
            icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => onView(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            icon={<DownloadOutlined style={{ color: '#52c41a' }} />} 
            onClick={() => onDownload(record)}
          >
            Download
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table 
    rowKey="id" 
    columns={columns} 
    dataSource={reports} 
    pagination={{ pageSize: 5 }}
    scroll={{ x: true }}
  />;
};

export default ReportsTable;