import React, { useState } from "react";
import { Layout, Row, Col, Card, Button, Tabs, message, Divider } from "antd";
import {
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PlusOutlined,
  UserOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import { Attendance, LeaveRequest } from "./types";
// import HeaderComponent from "../../../components/PageHeader";
import TodayAttendanceTable from "./components/TodayAttendance/TodayAttendanceTable";
import TodayAttendanceModal from "./components/TodayAttendance/TodayAttendanceModal";
import LeaveApplicationsTable from "./components/LeaveApplications/LeaveApplicationsTable";
import LeaveApplicationsModal from "./components/LeaveApplications/LeaveApplicationsModal";
import AttendanceCalendar from "./components/AttendanceCalendar/AttendanceCalendar";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";

const { Content } = Layout;
const { TabPane } = Tabs;

// Styled Components (same as before, but simplified)
const StyledLayout = styled(Layout)`...`;
const DashboardContent = styled(Content)`...`;
const StatCard = styled(Card)`...`;
const StatContent = styled.div`...`;
const StatInfo = styled.div`...`;
const StatLabel = styled.span`...`;
const StatValue = styled.h3`...`;
const StatIcon = styled.div`...`;
const GreenStatIcon = styled(StatIcon)`...`;
const OrangeStatIcon = styled(StatIcon)`...`;
const PurpleStatIcon = styled(StatIcon)`...`;
const RedStatIcon = styled(StatIcon)`...`;
const DirectoryCard = styled(Card)`...`;
const DirectoryHeader = styled.div`...`;
const TabHeader = styled.div`...`;

const AttendanceAndLeave: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [leaveData, setLeaveData] = useState<LeaveRequest[]>([]);
  const [todayModalVisible, setTodayModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | LeaveRequest | null>(null);

  const openTodayModal = (record?: Attendance) => {
    setEditingRecord(record || null);
    setTodayModalVisible(true);
  };

  const openLeaveModal = (record?: LeaveRequest) => {
    setEditingRecord(record || null);
    setLeaveModalVisible(true);
  };

  const closeTodayModal = () => {
    setTodayModalVisible(false);
    setEditingRecord(null);
  };

  const closeLeaveModal = () => {
    setLeaveModalVisible(false);
    setEditingRecord(null);
  };

  const handleSaveAttendance = (data: Attendance) => {
    if (editingRecord && "status" in editingRecord) {
      setAttendanceData(prev => prev.map((item: any) => item.id === editingRecord.id ? { ...data, id: item.id } : item));
      message.success("Attendance updated!");
    } else {
      setAttendanceData(prev => [...prev, { ...data, id: Date.now() }]);
      message.success("Attendance added!");
    }
    closeTodayModal();
  };

  const handleSaveLeave = (data: LeaveRequest) => {
    if (editingRecord && "leaveType" in editingRecord) {
      setLeaveData(prev => prev.map(item => item.id === editingRecord.id ? { ...data, id: item.id } : item));
      message.success("Leave request updated!");
    } else {
      setLeaveData(prev => [...prev, { ...data, id: Date.now() }]);
      message.success("Leave request added!");
    }
    closeLeaveModal();
  };

  const handleDeleteAttendance = (id: number) => {
    setAttendanceData(prev => prev.filter(item => item.id !== id));
    message.success("Attendance deleted!");
  };

  const handleDeleteLeave = (id: number) => {
    setLeaveData(prev => prev.filter(item => item.id !== id));
    message.success("Leave request deleted!");
  };

  const statCardsData: any = [
    {
      title: "Today's Attendance",
      count: 245,
      icon: <TeamOutlined />,
      color: GreenStatIcon
    },
    {
      title: "Today's Absentees",
      count: 8,
      icon: <CloseCircleOutlined />,
      color: RedStatIcon
    },
    {
      title: "On Leave",
      count: 13,
      icon: <CalendarOutlined />,
      color: OrangeStatIcon
    },
    {
      title: "Late Arrivals",
      count: 12,
      icon: <ClockCircleOutlined />,
      color: PurpleStatIcon
    },
  ];

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Attendance & Leave Management"
        subtitle="Manage Employees Attendance & Leaves"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
      />

      <Row gutter={[24, 24]} justify="start">
        {statCardsData.map((card: any, index: any) => {
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
      <Divider />
      <DirectoryCard>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane
            key="1"
            tab={
              <TabHeader>
                <TeamOutlined />
                Today's Attendance
              </TabHeader>
            }
          >
            <TodayAttendanceTable
              data={attendanceData}
              onEdit={openTodayModal}
              onDelete={handleDeleteAttendance}
              />
          </TabPane>
          <TabPane
            key="2"
            tab={
              <TabHeader>
                <FileTextOutlined />
                Leave Applications
              </TabHeader>
            }
          >
            <LeaveApplicationsTable
              data={leaveData}
              onEdit={openLeaveModal}
              onDelete={handleDeleteLeave}
            />
          </TabPane>
          <TabPane
            key="3"
            tab={
              <TabHeader>
                <CalendarOutlined />
                Attendance Calendar
              </TabHeader>
            }
          >
            <AttendanceCalendar
              attendanceData={attendanceData}
              leaveData={leaveData}
            />
          </TabPane>
        </Tabs>
      </DirectoryCard>

      <TodayAttendanceModal
        visible={todayModalVisible}
        onClose={closeTodayModal}
        onSave={handleSaveAttendance}
        record={editingRecord as Attendance}
      />

      <LeaveApplicationsModal
        visible={leaveModalVisible}
        onClose={closeLeaveModal}
        onSave={handleSaveLeave}
        record={editingRecord as LeaveRequest}
      />
    </Wrapper>
  );
};

export default AttendanceAndLeave;