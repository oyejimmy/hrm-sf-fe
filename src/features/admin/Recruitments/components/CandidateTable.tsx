import React, { useState } from "react";
import { Table, Button, Space, Tag } from "antd";
// import { Candidate } from "../types";
import CandidateProfileModal from "./CandidateProfileModal";

const CandidateTable = ({ candidates }: any) => {
  const [selected, setSelected] = useState<any | null>(null);

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: any["status"]) => (
        <Tag color={status === "Hired" ? "green" : status === "Rejected" ? "red" : "blue"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" onClick={() => setSelected(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        dataSource={candidates}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 600 }}
      />
      <CandidateProfileModal
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default CandidateTable;
