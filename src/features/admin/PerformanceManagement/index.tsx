import React, { useState } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { PerformanceReview } from "./types";
import PerformanceReviewModal from "./components/PerformanceReviewModal";
import { PageWrapper, Header, StatusTag } from "./components/styles";

const PerformanceManagement: React.FC = () => {
  const [data, setData] = useState<PerformanceReview[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | undefined>();

  const handleAdd = () => {
    setEditingReview(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: PerformanceReview) => {
    setEditingReview(record);
    setModalVisible(true);
  };

  const handleSave = (review: PerformanceReview) => {
    if (review.id) {
      setData((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    } else {
      review.id = Date.now();
      setData((prev) => [...prev, review]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id?: number) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const columns: any = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Reviewer", dataIndex: "reviewer", key: "reviewer" },
    { title: "Review Period", dataIndex: "reviewPeriod", key: "reviewPeriod" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <StatusTag status={status}>{status}</StatusTag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PerformanceReview) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={`Delete review for ${record.employeeName}?`}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<EyeOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Header>
        <h2>Performance Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Review
        </Button>
      </Header>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />

      <PerformanceReviewModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialData={editingReview}
      />
    </PageWrapper>
  );
};

export default PerformanceManagement;
