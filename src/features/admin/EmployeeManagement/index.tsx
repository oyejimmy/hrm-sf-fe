import React, { useState } from "react";
import { Table, Button, Space, Input, Select, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import EmployeeModal from "./components/EmployeeModal";
import DeleteConfirm from "./components/DeleteConfirm";
import ViewDrawer from "./components/ViewDrawer";
import { Employee } from "./types";

const { Search } = Input;
const { Option } = Select;

const Wrapper = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: auto;
`;

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Employee | null>(null);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    const openModal = (record?: any) => {
        setEditingRecord(record || null);
        setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

    const handleSave = (data: Employee) => {
        if (editingRecord) {
            setEmployees((prev) => prev.map((e) => (e.id === data.id ? data : e)));
        } else {
            setEmployees((prev) => [...prev, { ...data, id: Date.now() }]);
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        setDeleteVisible(false);
    };

    const columns = [
        { title: "Name", dataIndex: "fullName", sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName) },
        { title: "Department", dataIndex: "department" },
        { title: "Designation", dataIndex: "designation" },
        { title: "Status", dataIndex: "status", render: (status: string) => <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag> },
        {
            title: "Actions",
            render: (_: any, record: Employee) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => { setSelectedRecord(record); setViewVisible(true); }} />
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm title="Delete employee?" onConfirm={() => handleDelete(record.id!)} okText="Yes" cancelText="No">
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Wrapper>
            <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                <Search placeholder="Search employees" style={{ width: 250 }} />
                <Select placeholder="Filter by Department" style={{ width: 200 }} allowClear>
                    <Option value="HR">HR</Option>
                    <Option value="IT">IT</Option>
                    <Option value="Finance">Finance</Option>
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Employee
                </Button>
            </Space>

            <Table rowKey="id" columns={columns} dataSource={employees} pagination={{ pageSize: 5 }} />

            {modalVisible && (
                <EmployeeModal visible={modalVisible} onClose={closeModal} onSave={handleSave} record={editingRecord} />
            )}

            {deleteVisible && selectedRecord && (
                <DeleteConfirm
                    visible={deleteVisible}
                    onClose={() => setDeleteVisible(false)}
                    onConfirm={() => handleDelete(selectedRecord.id!)}
                    employeeName={selectedRecord.fullName}
                />
            )}

            {viewVisible && (
                <ViewDrawer visible={viewVisible} onClose={() => setViewVisible(false)} record={selectedRecord} />
            )}
        </Wrapper>
    );
};

export default EmployeeManagement;
