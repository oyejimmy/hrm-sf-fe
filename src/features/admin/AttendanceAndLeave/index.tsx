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
  background-color: ${props => props.theme.colors.background};
`;

const DashboardContent = styled(Content)`
  padding: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const StatCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.borderLight};
  background-color: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.sm};
  height: 100%;
  
  .ant-card-body {
    padding: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .ant-card-body {
      padding: ${props => props.theme.spacing.md};
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
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

const StatValue = styled.h3`
  margin: ${props => props.theme.spacing.sm} 0 0 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin: ${props => props.theme.spacing.xs} 0 0 0;
  }
`;

const StatIcon = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const GreenStatIcon = styled(StatIcon)`
  color: ${props => props.theme.colors.success};
`;

const OrangeStatIcon = styled(StatIcon)`
  color: ${props => props.theme.colors.warning};
`;

const PurpleStatIcon = styled(StatIcon)`
  color: ${props => props.theme.colors.secondary};
`;

const AddPolicyButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const DirectoryCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.borderLight};
  background-color: ${props => props.theme.colors.surface};
  margin-top: ${props => props.theme.spacing.lg};
  
  .ant-card-body {
    padding: 0;
  }
`;

const DirectoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.md};
    padding: ${props => props.theme.spacing.md};
  }
`;

const SearchInput = styled(Input)`
  border-radius: ${props => props.theme.borderRadius.md};
  width: 250px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const StyledTable = styled(Table)`
  border-radius: ${props => props.theme.borderRadius.lg};
  
  .ant-table-thead > tr > th {
    background-color: ${props => props.theme.colors.surfaceSecondary};
    color: ${props => props.theme.colors.textPrimary};
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${props => props.theme.colors.borderLight};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  .ant-table-tbody > tr {
    background-color: ${props => props.theme.colors.surface};
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: ${props => props.theme.colors.surfaceSecondary} !important;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: ${props => props.theme.spacing.sm};
    }
  }
`;

const PageTitle = styled.h4`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
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
                if (status === 'Present') color = 'success';
                if (status === 'Absent') color = 'error';
                if (status === 'Late') color = 'warning';
                if (status === 'Half Day') color = 'processing';

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
                if (status === 'Approved') color = 'success';
                if (status === 'Rejected') color = 'error';
                if (status === 'Pending') color = 'warning';

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