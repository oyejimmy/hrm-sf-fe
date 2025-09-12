import React, { useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  DatePicker,
  Select,
  Badge,
  Divider,
  Typography,
  Switch,
  List,
  Avatar,
  Modal,
  Form,
  Input,
  TimePicker
} from 'antd';
import {
  Clock,
  Calendar,
  BarChart3,
  Bell,
  Briefcase,
  Heart,
  Coffee,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
  MoreHorizontal,
  User
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';
import { Wrapper } from '../../../components/Wrapper';
import HeaderComponent from '../../../components/PageHeader';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div<{ isDarkMode: boolean }>`
  padding: 24px;
  background: ${props => props.isDarkMode ? '#141414' : '#f5f5f5'};
  min-height: 100vh;
`;

const DashboardCard = styled(Card) <{ isDarkMode: boolean }>`
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }
`;

const PrimaryButton = styled(Button)`
  border-radius: 8px;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
    color: white;
  }
`;

const SecondaryButton = styled(Button) <{ isDarkMode: boolean }>`    
  border-radius: 8px;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border-color: ${props => props.isDarkMode ? '#434343' : '#d9d9d9'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'};
  
  &:hover {
    border-color: ${props => props.isDarkMode ? '#1890ff' : '#40a9ff'};
    color: ${props => props.isDarkMode ? '#1890ff' : '#1890ff'};
  }
`;

const StatusIndicator = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'present': return '#f6ffed';
      case 'absent': return '#fff2f0';
      case 'late': return '#fffbe6';
      case 'leave': return '#f0f5ff';
      default: return '#fafafa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'present': return '#52c41a';
      case 'absent': return '#ff4d4f';
      case 'late': return '#faad14';
      case 'leave': return '#1890ff';
      default: return '#d9d9d9';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'present': return '#b7eb8f';
      case 'absent': return '#ffccc7';
      case 'late': return '#ffe58f';
      case 'leave': return '#adc6ff';
      default: return '#d9d9d9';
    }
  }};
`;

// CheckInCheckOutPanel Component
const CheckInCheckOutPanel: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(currentTime);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
  };

  return (
    <DashboardCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={18} />
          <span>Check-In / Check-Out</span>
        </div>
      }
      isDarkMode={isDarkMode}
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Text style={{ fontSize: 48, fontWeight: 600, color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#262626' }}>
          {currentTime}
        </Text>
        <div style={{ margin: '16px 0' }}>
          <StatusIndicator status={isCheckedIn ? 'present' : 'absent'}>
            {isCheckedIn ? (
              <>
                <CheckCircle size={14} style={{ marginRight: 4 }} />
                Clocked In at {checkInTime}
              </>
            ) : (
              <>
                <AlertCircle size={14} style={{ marginRight: 4 }} />
                Not Clocked In
              </>
            )}
          </StatusIndicator>
        </div>
        {isCheckedIn ? (
          <PrimaryButton
            icon={<LogOut size={16} />}
            onClick={handleCheckOut}
            style={{ padding: '12px 24px', height: 'auto' }}
          >
            Check Out
          </PrimaryButton>
        ) : (
          <PrimaryButton
            icon={<LogIn size={16} />}
            onClick={handleCheckIn}
            style={{ padding: '12px 24px', height: 'auto' }}
          >
            Check In
          </PrimaryButton>
        )}
      </div>
    </DashboardCard>
  );
};

// TodaySummary Component
const TodaySummary: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const todayData = {
    hoursWorked: 7.5,
    targetHours: 8,
    breaksTaken: 2,
    breakTime: 45,
    status: 'present'
  };

  return (
    <DashboardCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} />
          <span>Today's Summary</span>
        </div>
      }
      isDarkMode={isDarkMode}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Hours Worked"
            value={todayData.hoursWorked}
            suffix="/ 8h"
            valueStyle={{ color: todayData.hoursWorked >= todayData.targetHours ? '#52c41a' : '#faad14' }}
          />
          <Progress
            percent={(todayData.hoursWorked / todayData.targetHours) * 100}
            showInfo={false}
            strokeColor={todayData.hoursWorked >= todayData.targetHours ? '#52c41a' : '#1890ff'}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Breaks Taken"
            value={todayData.breaksTaken}
            suffix={`(${todayData.breakTime} min)`}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <Coffee size={14} style={{ marginRight: 4 }} />
            <Text type="secondary">Last break: 1:30 PM - 1:45 PM</Text>
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: '16px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Today's Status:</Text>
        <StatusIndicator status={todayData.status}>
          {todayData.status === 'present' ? 'Present' : 'Absent'}
        </StatusIndicator>
      </div>
    </DashboardCard>
  );
};

// AttendanceHistoryTable Component
const AttendanceHistoryTable: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={14} />
          {date}
        </div>
      ),
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours: number) => (
        <Text strong={hours >= 8} type={hours >= 8 ? 'success' : hours >= 6 ? 'warning' : 'danger'}>
          {hours}h
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let icon;
        switch (status) {
          case 'present': icon = <CheckCircle size={14} />; break;
          case 'absent': icon = <AlertCircle size={14} />; break;
          case 'late': icon = <Clock size={14} />; break;
          case 'leave': icon = <Briefcase size={14} />; break;
          default: icon = <AlertCircle size={14} />;
        }

        return (
          <StatusIndicator status={status}>
            {icon}
            <span style={{ marginLeft: 4 }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </StatusIndicator>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          Details
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      date: '2023-06-15',
      checkIn: '09:15 AM',
      checkOut: '06:00 PM',
      hours: 8.75,
      status: 'present',
    },
    {
      key: '2',
      date: '2023-06-14',
      checkIn: '09:45 AM',
      checkOut: '05:30 PM',
      hours: 7.75,
      status: 'late',
    },
    {
      key: '3',
      date: '2023-06-13',
      checkIn: '08:30 AM',
      checkOut: '05:45 PM',
      hours: 9.25,
      status: 'present',
    },
    {
      key: '4',
      date: '2023-06-12',
      checkIn: '09:00 AM',
      checkOut: '04:45 PM',
      hours: 7.75,
      status: 'present',
    },
    {
      key: '5',
      date: '2023-06-11',
      checkIn: '-',
      checkOut: '-',
      hours: 0,
      status: 'absent',
    },
    {
      key: '6',
      date: '2023-06-10',
      checkIn: '09:10 AM',
      checkOut: '06:15 PM',
      hours: 9.08,
      status: 'present',
    },
    {
      key: '7',
      date: '2023-06-09',
      checkIn: '10:30 AM',
      checkOut: '06:00 PM',
      hours: 7.5,
      status: 'late',
    },
  ];

  return (
    <DashboardCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={18} />
          <span>Attendance History</span>
        </div>
      }
      extra={
        <div style={{ display: 'flex', gap: 8 }}>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">All Status</Option>
            <Option value="present">Present</Option>
            <Option value="absent">Absent</Option>
            <Option value="late">Late</Option>
            <Option value="leave">Leave</Option>
          </Select>
          <SecondaryButton isDarkMode={isDarkMode} icon={<Download size={16} />}>
            Export
          </SecondaryButton>
        </div>
      }
      isDarkMode={isDarkMode}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </DashboardCard>
  );
};

// LeaveBalance Component
const LeaveBalance: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const leaveData = [
    {
      type: 'Vacation Leave',
      icon: <Briefcase size={16} />,
      used: 5,
      total: 15,
      color: '#1890ff',
    },
    {
      type: 'Sick Leave',
      icon: <Heart size={16} />,
      used: 2,
      total: 10,
      color: '#52c41a',
    },
    {
      type: 'Personal Leave',
      icon: <User size={16} />,
      used: 1,
      total: 5,
      color: '#faad14',
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <DashboardCard
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={18} />
            <span>Leave Balance</span>
          </div>
        }
        extra={
          <PrimaryButton onClick={showModal}>
            Request Leave
          </PrimaryButton>
        }
        isDarkMode={isDarkMode}
      >
        {leaveData.map((leave, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {leave.icon}
                <Text>{leave.type}</Text>
              </div>
              <Text strong>
                {leave.total - leave.used} days left
              </Text>
            </div>
            <Progress
              percent={(leave.used / leave.total) * 100}
              showInfo={false}
              strokeColor={leave.color}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {leave.used} days used
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {leave.total} days total
              </Text>
            </div>
          </div>
        ))}
      </DashboardCard>

      <Modal
        title="Request Leave"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <PrimaryButton key="submit" onClick={handleCancel}>
            Submit Request
          </PrimaryButton>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Leave Type">
            <Select placeholder="Select leave type">
              <Option value="vacation">Vacation Leave</Option>
              <Option value="sick">Sick Leave</Option>
              <Option value="personal">Personal Leave</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Reason">
            <Input.TextArea rows={4} placeholder="Please provide a reason for your leave" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// AttendanceAnalytics Component
const AttendanceAnalytics: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const data = [
    { month: 'Jan', present: 22, absent: 2, late: 3 },
    { month: 'Feb', present: 20, absent: 4, late: 2 },
    { month: 'Mar', present: 23, absent: 1, late: 2 },
    { month: 'Apr', present: 21, absent: 3, late: 2 },
    { month: 'May', present: 22, absent: 2, late: 1 },
    { month: 'Jun', present: 18, absent: 0, late: 4 },
  ];

  return (
    <DashboardCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} />
          <span>Attendance Analytics</span>
        </div>
      }
      extra={
        <Select defaultValue="monthly" style={{ width: 120 }}>
          <Option value="monthly">Monthly</Option>
          <Option value="quarterly">Quarterly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      }
      isDarkMode={isDarkMode}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Total Working Days"
            value={22}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Average Hours"
            value={8.2}
            suffix="h"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Punctuality Rate"
            value={92}
            suffix="%"
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>
      <Divider />
      <div style={{ height: 200, background: isDarkMode ? '#1f1f1f' : '#fafafa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text type="secondary">Attendance chart visualization would appear here</Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, background: '#52c41a', borderRadius: 2 }}></div>
          <Text>Present</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, background: '#ff4d4f', borderRadius: 2 }}></div>
          <Text>Absent</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, background: '#faad14', borderRadius: 2 }}></div>
          <Text>Late</Text>
        </div>
      </div>
    </DashboardCard>
  );
};

// AttendanceNotifications Component
const AttendanceNotifications: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const notifications = [
    {
      id: 1,
      title: 'Missed Check-Out',
      description: 'You forgot to check out yesterday',
      time: '2 hours ago',
      icon: <Bell size={16} />,
      type: 'warning',
    },
    {
      id: 2,
      title: 'Leave Approved',
      description: 'Your vacation leave for June 20-22 has been approved',
      time: '1 day ago',
      icon: <CheckCircle size={16} />,
      type: 'success',
    },
    {
      id: 3,
      title: 'Attendance Policy Update',
      description: 'Please review the updated attendance policy',
      time: '3 days ago',
      icon: <AlertCircle size={16} />,
      type: 'info',
    },
  ];

  return (
    <DashboardCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} />
          <span>Notifications</span>
        </div>
      }
      isDarkMode={isDarkMode}
    >
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  style={{
                    backgroundColor:
                      item.type === 'warning' ? '#fffbe6' :
                        item.type === 'success' ? '#f6ffed' :
                          '#e6f7ff',
                    color:
                      item.type === 'warning' ? '#faad14' :
                        item.type === 'success' ? '#52c41a' :
                          '#1890ff'
                  }}
                  icon={item.icon}
                />
              }
              title={item.title}
              description={
                <div>
                  <div>{item.description}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </DashboardCard>
  );
};

// Main Component
const EmployeeAttendance: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Attendance Dashboard"
        subtitle="Manage your Attendance and WFH"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <CheckInCheckOutPanel isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} lg={16}>
          <TodaySummary isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} lg={12}>
          <LeaveBalance isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24} lg={12}>
          <AttendanceAnalytics isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24}>
          <AttendanceHistoryTable isDarkMode={isDarkMode} />
        </Col>
        <Col xs={24}>
          <AttendanceNotifications isDarkMode={isDarkMode} />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default EmployeeAttendance;