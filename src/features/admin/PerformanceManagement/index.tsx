import React, { useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Input,
  Select,
  Rate,
  Tag,
  Row,
  Col,
  Divider,
  Statistic,
  DatePicker,
  Dropdown,
  Menu,
  message,
  Typography,
  Table,
  Form,
  Space
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  Star,
  PlusCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import dayjs from 'dayjs';
import HeaderComponent from '../../../components/PageHeader';
import {
  Employee,
  Reviewer,
  PerformanceReview
} from './types';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock data
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', department: 'Engineering', position: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager' },
  { id: '3', name: 'Robert Johnson', department: 'Sales', position: 'Sales Representative' },
  { id: '4', name: 'Emily Davis', department: 'Engineering', position: 'Frontend Developer' },
  { id: '5', name: 'Michael Wilson', department: 'HR', position: 'HR Specialist' },
];

const mockReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    department: 'Engineering',
    reviewerId: '1',
    reviewerName: 'Sarah Thompson',
    reviewPeriod: 'Q1 2023',
    status: 'Completed',
    assessment: {
      communication: 4,
      teamwork: 5,
      problemSolving: 4,
      technicalSkills: 5,
      initiative: 3,
      attendance: 5,
      goalAchievement: 4
    },
    overallRating: 4.3,
    comments: 'John has shown exceptional technical skills and teamwork.',
    goals: 'Lead a small team project, Improve presentation skills',
    strengths: 'Technical expertise, Team collaboration',
    areasForImprovement: 'Initiative, Public speaking',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-20'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    department: 'Marketing',
    reviewerId: '2',
    reviewerName: 'David Miller',
    reviewPeriod: 'Q1 2023',
    status: 'Approved',
    assessment: {
      communication: 5,
      teamwork: 4,
      problemSolving: 4,
      technicalSkills: 3,
      initiative: 5,
      attendance: 4,
      goalAchievement: 5
    },
    overallRating: 4.3,
    comments: 'Jane exceeded all her goals this quarter.',
    goals: 'Develop new social media strategy',
    strengths: 'Creativity, Leadership, Initiative',
    areasForImprovement: 'Technical skills, Data analysis',
    createdAt: '2023-04-10',
    updatedAt: '2023-04-18'
  }
];

const PerformanceManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm();

  const handleAddReview = () => {
    setEditingReview(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditReview = (review: PerformanceReview) => {
    setEditingReview(review);
    form.setFieldsValue({
      ...review,
      reviewDate: dayjs(review.createdAt),
    });
    setIsModalVisible(true);
  };

  const handleSaveReview = (values: any) => {
    const newReview: PerformanceReview = {
      ...values,
      id: editingReview?.id || Date.now().toString(),
      employeeId: values.employeeId,
      employeeName: mockEmployees.find(e => e.id === values.employeeId)?.name || '',
      department: mockEmployees.find(e => e.id === values.employeeId)?.department || '',
      reviewerId: '1',
      reviewerName: 'Admin',
      reviewPeriod: 'Q1 2023',
      status: editingReview?.status || 'Draft',
      assessment: {
        communication: 0,
        teamwork: 0,
        problemSolving: 0,
        technicalSkills: 0,
        initiative: 0,
        attendance: 0,
        goalAchievement: 0
      },
      overallRating: 0,
      createdAt: editingReview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingReview) {
      setReviews(reviews.map(review => review.id === newReview.id ? newReview : review));
      message.success('Performance review updated successfully.');
    } else {
      setReviews([...reviews, newReview]);
      message.success('Performance review added successfully.');
    }
    setIsModalVisible(false);
  };

  const handleDeleteReview = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this review?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        setReviews(reviews.filter(review => review.id !== id));
        message.success('Performance review deleted successfully.');
      },
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesEmployee = selectedEmployee ? review.employeeId === selectedEmployee : true;
    const matchesStatus = selectedStatus ? review.status === selectedStatus : true;
    const matchesSearch = searchTerm ?
      review.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesEmployee && matchesStatus && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    Draft: 'default',
    Submitted: 'blue',
    Approved: 'green',
    Completed: 'purple'
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Review Period',
      dataIndex: 'reviewPeriod',
      key: 'reviewPeriod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating: number) => (
        <Space>
          <Rate disabled defaultValue={rating} />
          <Text>{rating}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PerformanceReview) => (
        <Space size="middle">
          <Button
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleEditReview(record)}
          >
            Edit
          </Button>
          <Button
            icon={<ExclamationCircleOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteReview(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        title="Performance Management"
        subtitle="Manage employee performance reviews and evaluations"
        extraButtons={[
          <Button
            key="new-review"
            type="primary"
            icon={<PlusCircle size={16} />}
            onClick={handleAddReview}
          >
            New Review
          </Button>,
        ]}
        isDarkMode={isDarkMode}
      />

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={6}>
            <Input
              placeholder="Search reviews..."
              prefix={<Search size={16} />}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Select
              placeholder="Select Employee"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedEmployee(value === 'All' ? null : value)}
              defaultValue="All"
            >
              <Option value="All">All Employees</Option>
              {mockEmployees.map(emp => (
                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Select
              placeholder="Select Status"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedStatus(value === 'All' ? null : value)}
              defaultValue="All"
            >
              <Option value="All">All Statuses</Option>
              <Option value="Draft">Draft</Option>
              <Option value="Submitted">Submitted</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingReview ? 'Edit Performance Review' : 'Create New Performance Review'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveReview}
        >
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: 'Please select an employee!' }]}>
            <Select placeholder="Select Employee">
              {mockEmployees.map(employee => (
                <Option key={employee.id} value={employee.id}>{employee.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="goals" label="Goals">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="strengths" label="Strengths">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="areasForImprovement" label="Areas for Improvement">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingReview ? 'Update Review' : 'Create Review'}
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
};

export default PerformanceManagement;