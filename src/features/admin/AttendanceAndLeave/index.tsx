import React, { useState } from "react";
import { Layout, Row, Col, Card, Input, Button, Table, Tag, Space, Tabs, message } from "antd";
import { SmileOutlined, ExportOutlined, PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Attendance, LeaveRequest } from "./types";
import HeaderComponent from "../../../components/PageHeader";
import AttendanceAndLeaveModal from "./components/AttendanceAndLeaveModal";

const { Content } = Layout;
const { TabPane } = Tabs;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
//   background-color: ${props => props.theme.isDarkMode ? '#141414' : '#f5f5f5'};
`;

const DashboardContent = styled(Content)`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StatCard = styled(Card)`
  border-radius: 8px;
//   border: 1px solid ${props => props.theme.isDarkMode ? '#434343' : '#f0f0f0'};
//   background-color: ${props => props.theme.isDarkMode ? '#1f1f1f' : '#ffffff'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  height: 100%;
  
  .ant-card-body {
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
//   color: ${props => props.theme.isDarkMode ? '#8c8c8c' : '#8c8c8c'};
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatValue = styled.h3`
  margin: 8px 0 0 0;
//   color: ${props => props.theme.isDarkMode ? '#ffffff' : '#262626'};
  font-size: 24px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin: 4px 0 0 0;
  }
`;

const StatIcon = styled.div`
  font-size: 24px;
  color: #1890ff;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const GreenStatIcon = styled(StatIcon)`
  color: #52c41a;
`;

const OrangeStatIcon = styled(StatIcon)`
  color: #fa8c16;
`;

const PurpleStatIcon = styled(StatIcon)`
  color: #722ed1;
`;

const AddPolicyButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DirectoryCard = styled(Card)`
  border-radius: 8px;
//   border: 1px solid ${props => props.theme.isDarkMode ? '#434343' : '#f0f0f0'};
//   background-color: ${props => props.theme.isDarkMode ? '#1f1f1f' : '#ffffff'};
  margin-top: 24px;
  
  .ant-card-body {
    padding: 0;
  }
`;

const DirectoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
//   border-bottom: 1px solid ${props => props.theme.isDarkMode ? '#434343' : '#f0f0f0'};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
`;

const SearchInput = styled(Input)`
  border-radius: 6px;
  width: 250px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  border-radius: 8px;
  
  .ant-table-thead > tr > th {
    // background-color: ${props => props.theme.isDarkMode ? '#1d1d1d' : '#fafafa'};
    // color: ${props => props.theme.isDarkMode ? '#ffffff' : '#262626'};
    // border-bottom: 1px solid ${props => props.theme.isDarkMode ? '#434343' : '#f0f0f0'};
  }
  
  .ant-table-tbody > tr > td {
    // border-bottom: 1px solid ${props => props.theme.isDarkMode ? '#434343' : '#f0f0f0'};
    // color: ${props => props.theme.isDarkMode ? '#ffffff' : '#262626'};
  }
  
  .ant-table-tbody > tr {
    // background-color: ${props => props.theme.isDarkMode ? '#1f1f1f' : '#ffffff'};
  }
  
  .ant-table-tbody > tr:hover > td {
    // background-color: ${props => props.theme.isDarkMode ? '#2a2a2a' : '#fafafa'} !important;
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
`;

const PageTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
//   color: ${props => props.theme.isDarkMode ? '#ffffff' : '#262626'};
`;

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

    const attendanceColumns: any = [
        { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
        { title: "Date", dataIndex: "date", key: "date" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = 'default';
                if (status === 'Present') color = 'green';
                if (status === 'Absent') color = 'red';
                if (status === 'Late') color = 'orange';
                if (status === 'Half Day') color = 'blue';

                return <Tag color={color}>{status}</Tag>;
            }
        },
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = 'default';
                if (status === 'Approved') color = 'green';
                if (status === 'Rejected') color = 'red';
                if (status === 'Pending') color = 'orange';

                return <Tag color={color}>{status}</Tag>;
            }
        },
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

    const statCardsData = [
        {
            title: "Present Today",
            count: 245,
            icon: <SmileOutlined />,
            color: GreenStatIcon
        },
        {
            title: "Absent Today",
            count: 8,
            icon: <ExportOutlined />,
            color: OrangeStatIcon
        },
        {
            title: "On Leave",
            count: 13,
            icon: <ExportOutlined />,
            color: OrangeStatIcon
        },
        {
            title: "Late Arrivals",
            count: 12,
            icon: <UserOutlined />,
            color: PurpleStatIcon
        },
    ];

    return (
        <StyledLayout>
            <HeaderComponent title="Attendance & Leave Management" />

            <DashboardContent>
                <Row gutter={[24, 24]} justify="start">
                    {statCardsData.map((card, index) => {
                        const IconComponent = card.color;
                        return (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <StatCard>
                                    <StatContent>
                                        <StatInfo>
                                            <StatLabel>{card.title}</StatLabel>
                                            <StatValue>{card.count}</StatValue>
                                        </StatInfo>
                                        <IconComponent>
                                            {card.icon}
                                        </IconComponent>
                                    </StatContent>
                                </StatCard>
                            </Col>
                        );
                    })}
                </Row>

                <DirectoryCard>
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Today's Attendance" key="1">
                            <DirectoryHeader>
                                <PageTitle>Today's Attendance</PageTitle>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openModal("attendance")}
                                    >
                                        Add Attendance
                                    </Button>
                                    <SearchInput
                                        placeholder="Search employees"
                                        prefix={<SearchOutlined />}
                                    />
                                </Space>
                            </DirectoryHeader>
                            <StyledTable
                                rowKey="id"
                                columns={attendanceColumns}
                                dataSource={attendanceData}
                                pagination={{ pageSize: 5 }}
                                scroll={{ x: true }}
                            />
                        </TabPane>
                        <TabPane tab="Leave Requests" key="2">
                            <DirectoryHeader>
                                <PageTitle>Leave Requests</PageTitle>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openModal("leave")}
                                    >
                                        Add Leave Request
                                    </Button>
                                    <SearchInput
                                        placeholder="Search employees"
                                        prefix={<SearchOutlined />}
                                    />
                                </Space>
                            </DirectoryHeader>
                            <StyledTable
                                rowKey="id"
                                columns={leaveColumns}
                                dataSource={leaveData}
                                pagination={{ pageSize: 5 }}
                                scroll={{ x: true }}
                            />
                        </TabPane>
                    </Tabs>
                </DirectoryCard>
            </DashboardContent>

            <AttendanceAndLeaveModal
                visible={modalVisible}
                onClose={closeModal}
                onSave={handleSave}
                type={modalType}
                record={editingRecord}
            />
        </StyledLayout>
    );
};

export default AttendanceAndLeave;