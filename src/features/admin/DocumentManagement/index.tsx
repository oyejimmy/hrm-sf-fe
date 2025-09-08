import React, { useState } from "react";
import { Table, Button, Space, Typography, Popconfirm, Card, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import PreviewDocumentModal from "./components/PreviewDocumentModal";
import DocumentModal from "./components/DocumentModal";
import { EmployeeDocument } from "./types";
import styled from "styled-components";

const { Title } = Typography;

const Wrapper = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: auto;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
`;

const DocumentManagement: React.FC = () => {
    const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EmployeeDocument | null>(null);
    const [previewRecord, setPreviewRecord] = useState<EmployeeDocument | null>(null);

    const openModal = (record?: EmployeeDocument) => {
        setEditingRecord(record || null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingRecord(null);
    };

    const handleSave = (data: EmployeeDocument) => {
        if (editingRecord) {
            setDocuments((prev) =>
                prev.map((d) => (d.id === editingRecord.id ? { ...data, id: d.id } : d))
            );
            message.success("Document updated!");
        } else {
            setDocuments((prev) => [...prev, { ...data, id: Date.now() }]);
            message.success("Document added!");
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        message.success("Document deleted!");
    };

    const openPreview = (record: EmployeeDocument) => {
        setPreviewRecord(record);
        setPreviewVisible(true);
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewRecord(null);
    };

    const columns = [
        { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
        { title: "Document Type", dataIndex: "documentType", key: "documentType" },
        { title: "File Name", dataIndex: "fileName", key: "fileName" },
        { title: "Upload Date", dataIndex: "uploadDate", key: "uploadDate" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: EmployeeDocument) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => openPreview(record)} />
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete this document?"
                        onConfirm={() => handleDelete(record.id!)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Wrapper>
            <StyledCard>
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Title level={3} style={{ textAlign: "center" }}>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        Document Management
                    </Title>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => openModal()}
                    >
                        Add Document
                    </Button>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={documents}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: true }}
                    />
                </Space>
            </StyledCard>

            {modalVisible && (
                <DocumentModal
                    visible={modalVisible}
                    onClose={closeModal}
                    onSave={handleSave}
                    record={editingRecord}
                />
            )}

            {previewVisible && (
                <PreviewDocumentModal
                    visible={previewVisible}
                    onClose={closePreview}
                    record={previewRecord}
                />
            )}
        </Wrapper>
    );
};

export default DocumentManagement;
