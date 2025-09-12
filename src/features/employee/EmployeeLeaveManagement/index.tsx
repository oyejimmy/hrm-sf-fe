import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Badge,
  Calendar,
  List,
  Avatar,
  Divider,
  Switch,
  theme,
  Layout,
  Space,
  Progress,
  Alert,
  Statistic
} from 'antd';
import {
  Sun,
  Thermometer,
  Briefcase,
  Calendar as CalendarIcon,
  FileText,
  Paperclip,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Hourglass,
  Filter,
  Bell,
  Check,
  X,
  AlertCircle,
  Book,
  Moon,
  Plus,
  Download,
  Upload as UploadIcon
} from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Content, Sider } = Layout;
const { TextArea } = Input;

// Styled Components
const StyledCard = styled(Card) <{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'};
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 16px;
  
  .ant-card-head {
    border-bottom: 1px solid var(--border-color);
  }
  
  .ant-card-head-title {
    color: var(--text-color);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const IconWrapper = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: ${props => props.$color ? `${props.$color}15` : '#1890ff15'};
  color: ${props => props.$color || '#1890ff'};
  margin-right: 12px;
`;

const LeaveTypeCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
`;

const StatusTag = styled(Tag)`
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  border: none;
`;

// Mock Data
const leaveTypes = [
  { type: 'Annual Leave', remaining: 12, total: 20, icon: <Sun size={20} />, color: '#faad14' },
  { type: 'Sick Leave', remaining: 8, total: 10, icon: <Thermometer size={20} />, color: '#f5222d' },
  { type: 'Casual Leave', remaining: 5, total: 7, icon: <Briefcase size={20} />, color: '#52c41a' },
];

const leaveHistoryData = [
  {
    key: '1',
    type: 'Annual Leave',
    dates: '2023-06-15 to 2023-06-20',
    duration: 5,
    status: 'Approved',
    notes: 'Family vacation'
  },
  {
    key: '2',
    type: 'Sick Leave',
    dates: '2023-07-01 to 2023-07-03',
    duration: 2,
    status: 'Approved',
    notes: 'Medical appointment'
  },
  {
    key: '3',
    type: 'Casual Leave',
    dates: '2023-08-10 to 2023-08-11',
    duration: 1,
    status: 'Pending',
    notes: 'Personal work'
  },
  {
    key: '4',
    type: 'Annual Leave',
    dates: '2023-09-05 to 2023-09-15',
    duration: 8,
    status: 'Rejected',
    notes: 'Overseas trip - during critical project'
  },
];

const notifications = [
  { id: 1, type: 'approval', message: 'Your leave request for June 15-20 has been approved', time: '2 hours ago', read: false },
  { id: 2, type: 'reminder', message: 'Reminder: You have planned leave next week (Aug 10-11)', time: '1 day ago', read: true },
  { id: 3, type: 'request', message: 'New leave request from John Doe needs your approval', time: '2 days ago', read: false },
];

// Main Component
const EmployeeLeaveManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState(leaveHistoryData);
  const [activeNotifications, setActiveNotifications] = useState(notifications);
  const [form] = Form.useForm();

  const { isDarkMode } = useTheme();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    // Here you would typically send the data to your backend
    const newRequest = {
      key: `${leaveRequests.length + 1}`,
      type: values.leaveType,
      dates: `${values.dates[0].format('YYYY-MM-DD')} to ${values.dates[1].format('YYYY-MM-DD')}`,
      duration: values.duration,
      status: 'Pending',
      notes: values.reason
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Dates',
      dataIndex: 'dates',
      key: 'dates',
    },
    {
      title: 'Duration (Days)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Approved') color = 'green';
        if (status === 'Pending') color = 'orange';
        if (status === 'Rejected') color = 'red';

        return <StatusTag color={color}>{status}</StatusTag>;
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  const markNotificationAsRead = (id: number) => {
    setActiveNotifications(activeNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Leave Management Dashboard"
        subtitle="Manage your Leaves and WFH"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
        extraButtons={[
          <Button
            type="primary"
            icon={<Plus size={16} />}
            block
            onClick={showModal}
          >
            Request Leave
          </Button>
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <StyledCard isDarkMode={isDarkMode} title="Leave Balance" bordered={false}>
            {leaveTypes.map((leave, index) => (
              <LeaveTypeCard key={index}>
                <IconWrapper $color={leave.color}>
                  {leave.icon}
                </IconWrapper>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ color: 'var(--text-color)' }}>{leave.type}</Text>
                  <div>
                    <Text style={{ color: 'var(--text-color-secondary)' }}>
                      {leave.remaining} days remaining of {leave.total}
                    </Text>
                  </div>
                </div>
                <Progress
                  type="circle"
                  percent={Math.round((leave.remaining / leave.total) * 100)}
                  size={50}
                  strokeColor={leave.color}
                  format={percent => `${leave.remaining}`}
                />
              </LeaveTypeCard>
            ))}
          </StyledCard>
        </Col>

        <Col xs={24} lg={16}>
          <StyledCard
          isDarkMode={isDarkMode}
            title="Leave Calendar"
            bordered={false}
            extra={
              <Space>
                <Button icon={<ChevronLeft size={16} />} />
                <Text strong>August 2023</Text>
                <Button icon={<ChevronRight size={16} />} />
              </Space>
            }
          >
            <Calendar
              fullscreen={false}
              headerRender={({ value, onChange }) => null}
            />
          </StyledCard>
        </Col>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <StyledCard
          isDarkMode={isDarkMode}
            title="Leave History"
            bordered={false}
            extra={
              <Space>
                <Button icon={<Filter size={16} />}>Filter</Button>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={leaveRequests}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
            />
          </StyledCard>
        </Col>
      </Row>
      <Modal
        title="Request Leave"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered

      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Leave Type"
            name="leaveType"
            rules={[{ required: true, message: 'Please select a leave type' }]}
          >
            <Select placeholder="Select leave type">
              <Option value="Annual Leave">
                <Space>
                  <Sun size={16} />
                  Annual Leave
                </Space>
              </Option>
              <Option value="Sick Leave">
                <Space>
                  <Thermometer size={16} />
                  Sick Leave
                </Space>
              </Option>
              <Option value="Casual Leave">
                <Space>
                  <Briefcase size={16} />
                  Casual Leave
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date Range"
            name="dates"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              suffixIcon={<CalendarIcon size={16} />}
            />
          </Form.Item>

          <Form.Item
            label="Duration (Days)"
            name="duration"
          >
            <Input
              type="number"
              min={0.5}
              step={0.5}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please provide a reason for your leave' }]}
          >
            <TextArea
              rows={4}
              placeholder="Please provide details for your leave request"
            />
          </Form.Item>

          <Form.Item
            label="Attachment"
            name="attachment"
          >
            <Upload>
              <Button icon={<UploadIcon size={16} />}>Upload File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<Send size={16} />}>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
};

export default EmployeeLeaveManagement;