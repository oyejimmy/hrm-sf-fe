import React, { useState } from "react";
import { Table, Button, Space, Typography, Popconfirm, Card, Tag, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, NotificationOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Notification } from "./types";
import NotificationModal from "./components/NotificationModal";

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

const CommunicationAndNotification: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Notification | null>(null);

    const openModal = (record?: Notification) => {
        setEditingRecord(record || null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingRecord(null);
    };

    const handleSave = (data: Notification) => {
        if (editingRecord) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === editingRecord.id ? { ...data, id: n.id } : n))
            );
            message.success("Notification updated!");
        } else {
            setNotifications((prev) => [...prev, { ...data, id: Date.now() }]);
            message.success("Notification added!");
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        message.success("Notification deleted!");
    };

    const columns: any = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <b>{text}</b>,
        },
        { title: "Message", dataIndex: "message", key: "message" },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            render: (priority: string) => {
                const color =
                    priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        { title: "Date", dataIndex: "date", key: "date" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Notification) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                    />
                    <Popconfirm
                        title="Delete this notification?"
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
                        <NotificationOutlined style={{ marginRight: 8 }} />
                        Communication & Notifications
                    </Title>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => openModal()}
                    >
                        Add Notification
                    </Button>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={notifications}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: true }}
                    />
                </Space>
            </StyledCard>

            {modalVisible && (
                <NotificationModal
                    visible={modalVisible}
                    onClose={closeModal}
                    onSave={handleSave}
                    record={editingRecord}
                />
            )}
        </Wrapper>
    );
};

export default CommunicationAndNotification;
