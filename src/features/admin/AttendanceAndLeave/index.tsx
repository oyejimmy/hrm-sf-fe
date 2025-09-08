import React, { useState } from "react";
import { Table, Button, Space, Typography, Tabs, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AttendanceAndLeaveModal from "./components/AttendanceAndLeaveModal";
import { Attendance, LeaveRequest } from "./types";

const { Title } = Typography;
const { TabPane } = Tabs;

const AttendanceAndLeave: React.FC = () => {
    const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
    const [leaveData, setLeaveData] = useState<LeaveRequest[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"attendance" | "leave">("attendance");
    const [editingRecord, setEditingRecord] = useState<Attendance | LeaveRequest | null>(null);

    const openModal = (type: "attendance" | "leave", record?: Attendance | LeaveRequest) => {
        setModalType(type);
        setEditingRecord(record || null);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingRecord(null);
    };

    const handleSave = (data: Attendance | LeaveRequest) => {
        if (modalType === "attendance") {
            if (editingRecord && "status" in editingRecord) {
                setAttendanceData((prev: any) =>
                    prev.map((item: any) => (item.id === editingRecord.id ? { ...data, id: item.id } : item))
                );
                message.success("Attendance updated!");
            } else {
                setAttendanceData((prev: any) => [...prev, { ...data, id: Date.now() }]);
                message.success("Attendance added!");
            }
        } else {
            if (editingRecord && "leaveType" in editingRecord) {
                setLeaveData((prev: any) =>
                    prev.map((item: any) => (item.id === editingRecord.id ? { ...data, id: item.id } : item))
                );
                message.success("Leave request updated!");
            } else {
                setLeaveData((prev: any) => [...prev, { ...data, id: Date.now() }]);
                message.success("Leave request added!");
            }
        }
        closeModal();
    };

    const handleDelete = (id: number, type: "attendance" | "leave") => {
        if (type === "attendance") {
            setAttendanceData((prev) => prev.filter((item) => item.id !== id));
            message.success("Attendance deleted!");
        } else {
            setLeaveData((prev) => prev.filter((item) => item.id !== id));
            message.success("Leave request deleted!");
        }
    };

    const attendanceColumns = [
        { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Attendance) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal("attendance", record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id!, "attendance")} />
                </Space>
            ),
        },
    ];

    const leaveColumns: any = [
        { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
        { title: "Leave Type", dataIndex: "leaveType", key: "leaveType" },
        { title: "Start Date", dataIndex: "startDate", key: "startDate" },
        { title: "End Date", dataIndex: "endDate", key: "endDate" },
        { title: "Reason", dataIndex: "reason", key: "reason" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: LeaveRequest) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal("leave", record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id!, "leave")} />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 16 }}>
            <Title level={3} style={{ textAlign: "center" }}>Attendance & Leave Management</Title>

            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Attendance" key="1">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        style={{ marginBottom: 16 }}
                        onClick={() => openModal("attendance")}
                    >
                        Mark Attendance
                    </Button>
                    <Table
                        rowKey="id"
                        columns={attendanceColumns}
                        dataSource={attendanceData}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: true }}
                    />
                </TabPane>

                <TabPane tab="Leave Requests" key="2">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        style={{ marginBottom: 16 }}
                        onClick={() => openModal("leave")}
                    >
                        Request Leave
                    </Button>
                    <Table
                        rowKey="id"
                        columns={leaveColumns}
                        dataSource={leaveData}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: true }}
                    />
                </TabPane>
            </Tabs>

            {modalVisible && (
                <AttendanceAndLeaveModal
                    visible={modalVisible}
                    onClose={closeModal}
                    onSave={handleSave}
                    type={modalType}
                    record={editingRecord}
                />
            )}
        </div>
    );
};

export default AttendanceAndLeave;
