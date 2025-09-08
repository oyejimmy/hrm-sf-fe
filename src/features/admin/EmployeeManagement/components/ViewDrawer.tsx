import React from "react";
import { Drawer, Descriptions, Avatar, Tag } from "antd";
import { Employee } from "../types";

interface Props {
    visible: boolean;
    onClose: () => void;
    record: Employee | null | any;
}

const ViewDrawer: React.FC<Props> = ({ visible, onClose, record }) => {
    if (!record) return null;

    return (
        <Drawer
            title="Employee Details"
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
        >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
                <Avatar size={80} src={record.profilePicture} />
                <h3>{record.fullName}</h3>
                <Tag color={record.status === "Active" ? "green" : "red"}>{record.status}</Tag>
            </div>

            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item>
                <Descriptions.Item label="Gender">{record.gender}</Descriptions.Item>
                <Descriptions.Item label="DOB">{record.dob}</Descriptions.Item>
                <Descriptions.Item label="Department">{record.department}</Descriptions.Item>
                <Descriptions.Item label="Designation">{record.designation}</Descriptions.Item>
                <Descriptions.Item label="Employee ID">{record.employeeId}</Descriptions.Item>
                <Descriptions.Item label="Joining Date">{record.joiningDate}</Descriptions.Item>
                <Descriptions.Item label="Role">{record.role}</Descriptions.Item>
                <Descriptions.Item label="Address">{record.address}</Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">{record.emergencyContact}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default ViewDrawer;
