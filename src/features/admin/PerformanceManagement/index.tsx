import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  Statistic,
  Progress,
  DatePicker,
  Dropdown,
  Menu,
  message,
  Typography
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  ClipboardCheck,
  FileSpreadsheet,
  PlusCircle
} from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import dayjs, { Dayjs } from 'dayjs';
import { Container } from './styles';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Types
interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
}

interface Reviewer {
  id: string;
  name: string;
  role: string;
}

interface Assessment {
  communication: number;
  teamwork: number;
  problemSolving: number;
  technicalSkills: number;
  initiative: number;
  attendance: number;
  goalAchievement: number;
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Completed';
  assessment: Assessment;
  overallRating: number;
  comments: string;
  goals: string;
  strengths: string;
  areasForImprovement: string;
  createdAt: string;
  updatedAt: string;
  employeeSignature?: string;
  reviewerSignature?: string;
}

interface FilterOptions {
  employee?: string;
  department?: string;
  reviewer?: string;
  reviewPeriod?: string;
  status?: string;
  dateRange?: any | [Dayjs, Dayjs] | null;
}

// Mock data
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', department: 'Engineering', position: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager' },
  { id: '3', name: 'Robert Johnson', department: 'Sales', position: 'Sales Representative' },
  { id: '4', name: 'Emily Davis', department: 'Engineering', position: 'Frontend Developer' },
  { id: '5', name: 'Michael Wilson', department: 'HR', position: 'HR Specialist' },
  { id: '6', name: 'Sarah Brown', department: 'Finance', position: 'Financial Analyst' },
  { id: '7', name: 'David Miller', department: 'Operations', position: 'Operations Manager' },
];

const mockReviewers: Reviewer[] = [
  { id: '1', name: 'Sarah Thompson', role: 'Senior Manager' },
  { id: '2', name: 'David Miller', role: 'Director' },
  { id: '3', name: 'Lisa Anderson', role: 'VP of HR' },
  { id: '4', name: 'James Wilson', role: 'Team Lead' },
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
    comments: 'John has shown exceptional technical skills and teamwork. He should work on taking more initiative in projects.',
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
    comments: 'Jane exceeded all her goals this quarter and showed great initiative in the new campaign.',
    goals: 'Develop new social media strategy, Train junior team members',
    strengths: 'Creativity, Leadership, Initiative',
    areasForImprovement: 'Technical skills, Data analysis',
    createdAt: '2023-04-10',
    updatedAt: '2023-04-18'
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Emily Davis',
    department: 'Engineering',
    reviewerId: '1',
    reviewerName: 'Sarah Thompson',
    reviewPeriod: 'Q1 2023',
    status: 'Submitted',
    assessment: {
      communication: 3,
      teamwork: 4,
      problemSolving: 5,
      technicalSkills: 5,
      initiative: 4,
      attendance: 5,
      goalAchievement: 3
    },
    overallRating: 4.1,
    comments: 'Emily is a strong technical contributor but needs to improve communication with stakeholders.',
    goals: 'Improve client communication, Obtain AWS certification',
    strengths: 'Technical skills, Problem-solving',
    areasForImprovement: 'Client communication, Documentation',
    createdAt: '2023-04-12',
    updatedAt: '2023-04-12'
  },
  {
    id: '4',
    employeeId: '3',
    employeeName: 'Robert Johnson',
    department: 'Sales',
    reviewerId: '3',
    reviewerName: 'Lisa Anderson',
    reviewPeriod: 'Q1 2023',
    status: 'Draft',
    assessment: {
      communication: 4,
      teamwork: 3,
      problemSolving: 3,
      technicalSkills: 3,
      initiative: 4,
      attendance: 4,
      goalAchievement: 4
    },
    overallRating: 3.6,
    comments: '',
    goals: 'Increase sales by 15%, Expand client base',
    strengths: 'Persistence, Product knowledge',
    areasForImprovement: 'Team collaboration, Sales technique',
    createdAt: '2023-04-05',
    updatedAt: '2023-04-05'
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Michael Wilson',
    department: 'HR',
    reviewerId: '4',
    reviewerName: 'James Wilson',
    reviewPeriod: 'Q1 2023',
    status: 'Completed',
    assessment: {
      communication: 5,
      teamwork: 5,
      problemSolving: 4,
      technicalSkills: 4,
      initiative: 4,
      attendance: 5,
      goalAchievement: 5
    },
    overallRating: 4.6,
    comments: 'Michael has excelled in all areas and has been instrumental in implementing our new HR system.',
    goals: 'Implement new HRIS, Reduce hiring time by 20%',
    strengths: 'Organization, Employee relations',
    areasForImprovement: 'Technical reporting, Data analysis',
    createdAt: '2023-04-18',
    updatedAt: '2023-04-25'
  },
];

// Departments for filter
const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

// Review periods for filter
const reviewPeriods = Array.from(new Set(mockReviews.map(review => review.reviewPeriod)));

// Status colors
const statusColors: Record<string, string> = {
  Draft: 'default',
  Submitted: 'blue',
  Approved: 'green',
  Completed: 'purple'
};

// Status icons
const statusIcons: Record<string, React.ReactNode> = {
  Draft: <ClockCircleOutlined />,
  Submitted: <SendOutlined />,
  Approved: <CheckCircleOutlined />,
  Completed: <CheckCircleOutlined />
};

// Main Component
const PerformanceManagement: React.FC = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<PerformanceReview[]>(mockReviews);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    averageRating: 0
  });

  // Calculate statistics
  useEffect(() => {
    const total = reviews.length;
    const completed = reviews.filter(r => r.status === 'Completed').length;
    const inProgress = reviews.filter(r => r.status !== 'Completed').length;
    const averageRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / total;

    setStats({
      total,
      completed,
      inProgress,
      averageRating: Number(averageRating.toFixed(1))
    });
  }, [reviews]);

  // Apply filters and search
  useEffect(() => {
    let result = reviews;

    // Apply filters
    if (filters.employee) {
      result = result.filter(review => review.employeeId === filters.employee);
    }

    if (filters.department) {
      result = result.filter(review => review.department === filters.department);
    }

    if (filters.reviewer) {
      result = result.filter(review => review.reviewerId === filters.reviewer);
    }

    if (filters.reviewPeriod) {
      result = result.filter(review => review.reviewPeriod === filters.reviewPeriod);
    }

    if (filters.status) {
      result = result.filter(review => review.status === filters.status);
    }

    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter((review: any) => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate >= filters.dateRange![0]!.toDate() &&
          reviewDate <= filters.dateRange![1]!.toDate();
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(review =>
        review.employeeName.toLowerCase().includes(query) ||
        review.reviewerName.toLowerCase().includes(query) ||
        review.department.toLowerCase().includes(query)
      );
    }

    // Apply status filter from dropdown
    if (selectedStatus !== 'All') {
      result = result.filter(review => review.status === selectedStatus);
    }

    setFilteredReviews(result);
  }, [filters, searchQuery, reviews, selectedStatus]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditReview = (review: PerformanceReview) => {
    setEditingReview(review);
    setIsModalVisible(true);
    form.setFieldsValue(review);
  };

  const handleDeleteReview = (id: string) => {
    Modal.confirm({
      title: 'Delete Performance Review',
      content: 'Are you sure you want to delete this performance review? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setReviews(prev => prev.filter(review => review.id !== id));
        message.success('Performance review deleted successfully');
      }
    });
  };

  const handleFormSubmit = (values: any) => {
    const reviewData = {
      ...values,
      overallRating: calculateOverallRating(values.assessment),
      employeeName: mockEmployees.find(e => e.id === values.employeeId)?.name || '',
      reviewerName: mockReviewers.find(r => r.id === values.reviewerId)?.name || '',
      department: mockEmployees.find(e => e.id === values.employeeId)?.department || '',
    };

    if (editingReview) {
      // Update existing review
      setReviews(prev => prev.map(r => r.id === editingReview.id ?
        { ...r, ...reviewData, updatedAt: new Date().toISOString().split('T')[0] } : r));
      message.success('Performance review updated successfully');
    } else {
      // Add new review
      const newReview: PerformanceReview = {
        ...reviewData,
        id: Date.now().toString(),
        status: 'Draft',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [...prev, newReview]);
      message.success('Performance review created successfully');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const calculateOverallRating = (assessment: Assessment): number => {
    const values = Object.values(assessment);
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string, record: PerformanceReview) => (
        <Space>
          <UserOutlined style={{ color: '#3b82f6' }} />
          <div>
            <div>{text}</div>
            <Text type="secondary">{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#8b5cf6' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Review Period',
      dataIndex: 'reviewPeriod',
      key: 'reviewPeriod',
      render: (text: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#10b981' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating: number) => (
        <Space>
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Text strong>{rating}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag icon={statusIcons[status]} color={statusColors[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PerformanceReview) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewReview(record)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditReview(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteReview(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewReview = (review: PerformanceReview) => {
    Modal.info({
      title: `Performance Review - ${review.employeeName}`,
      width: 800,
      content: (
        <div>
          <Divider orientation="left">Details</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>Employee:</strong> {review.employeeName}</p>
              <p><strong>Department:</strong> {review.department}</p>
              <p><strong>Review Period:</strong> {review.reviewPeriod}</p>
            </Col>
            <Col span={12}>
              <p><strong>Reviewer:</strong> {review.reviewerName}</p>
              <p><strong>Status:</strong> <Tag color={statusColors[review.status]}>{review.status}</Tag></p>
              <p><strong>Overall Rating:</strong> <Rate disabled defaultValue={review.overallRating} /> ({review.overallRating})</p>
            </Col>
          </Row>

          <Divider orientation="left">Assessment</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>Communication:</strong> <Rate disabled defaultValue={review.assessment.communication} /></p>
              <p><strong>Teamwork:</strong> <Rate disabled defaultValue={review.assessment.teamwork} /></p>
              <p><strong>Problem-solving:</strong> <Rate disabled defaultValue={review.assessment.problemSolving} /></p>
              <p><strong>Technical Skills:</strong> <Rate disabled defaultValue={review.assessment.technicalSkills} /></p>
            </Col>
            <Col span={12}>
              <p><strong>Initiative:</strong> <Rate disabled defaultValue={review.assessment.initiative} /></p>
              <p><strong>Attendance:</strong> <Rate disabled defaultValue={review.assessment.attendance} /></p>
              <p><strong>Goal Achievement:</strong> <Rate disabled defaultValue={review.assessment.goalAchievement} /></p>
            </Col>
          </Row>

          <Divider orientation="left">Feedback</Divider>
          <p><strong>Comments:</strong></p>
          <TextArea value={review.comments} autoSize readOnly />

          <p style={{ marginTop: 16 }}><strong>Goals:</strong></p>
          <TextArea value={review.goals} autoSize readOnly />

          <p style={{ marginTop: 16 }}><strong>Strengths:</strong></p>
          <TextArea value={review.strengths} autoSize readOnly />

          <p style={{ marginTop: 16 }}><strong>Areas for Improvement:</strong></p>
          <TextArea value={review.areasForImprovement} autoSize readOnly />
        </div>
      ),
      onOk() { },
    });
  };

  const statusMenu = (
    <Menu onClick={({ key }) => handleStatusChange(key)}>
      <Menu.Item key="All">All Statuses</Menu.Item>
      <Menu.Item key="Draft">Draft</Menu.Item>
      <Menu.Item key="Submitted">Submitted</Menu.Item>
      <Menu.Item key="Approved">Approved</Menu.Item>
      <Menu.Item key="Completed">Completed</Menu.Item>
    </Menu>
  );

  return (
    <Container>
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
          </Button>
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={stats.averageRating}
              precision={1}
              prefix={<Star size={16} fill="#f59e0b" color="#f59e0b" />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Search employees, reviewers..."
              prefix={<SearchOutlined />}
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Department"
              style={{ width: '100%' }}
              allowClear
              onChange={value => handleFilterChange('department', value)}
            >
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Review Period"
              style={{ width: '100%' }}
              allowClear
              onChange={value => handleFilterChange('reviewPeriod', value)}
            >
              {reviewPeriods.map(period => (
                <Option key={period} value={period}>{period}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Dropdown overlay={statusMenu} trigger={['click']}>
              <Button>
                Status: {selectedStatus} <MoreOutlined />
              </Button>
            </Dropdown>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddReview}
            >
              New Review
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Reviews Table */}
      <Card
        title="Performance Reviews"
        extra={
          <Text>
            Showing {filteredReviews.length} of {reviews.length} reviews
          </Text>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Evaluation Form Modal */}
      <Modal
        title={editingReview ? 'Edit Performance Review' : 'Create Performance Review'}
        visible={isModalVisible}
        width={800}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Employee"
                rules={[{ required: true, message: 'Please select an employee' }]}
              >
                <Select placeholder="Select employee">
                  {mockEmployees.map(emp => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reviewerId"
                label="Reviewer"
                rules={[{ required: true, message: 'Please select a reviewer' }]}
              >
                <Select placeholder="Select reviewer">
                  {mockReviewers.map(reviewer => (
                    <Option key={reviewer.id} value={reviewer.id}>
                      {reviewer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reviewPeriod"
                label="Review Period"
                rules={[{ required: true, message: 'Please select a review period' }]}
              >
                <Select placeholder="Select review period">
                  <Option value="Q1 2023">Q1 2023</Option>
                  <Option value="Q2 2023">Q2 2023</Option>
                  <Option value="Q3 2023">Q3 2023</Option>
                  <Option value="Q4 2023">Q4 2023</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="Draft"
              >
                <Select>
                  <Option value="Draft">Draft</Option>
                  <Option value="Submitted">Submitted</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Assessment Criteria</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['assessment', 'communication']}
                label="Communication Skills"
                rules={[{ required: true, message: 'Please rate communication skills' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name={['assessment', 'teamwork']}
                label="Teamwork"
                rules={[{ required: true, message: 'Please rate teamwork' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name={['assessment', 'problemSolving']}
                label="Problem-solving Ability"
                rules={[{ required: true, message: 'Please rate problem-solving ability' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name={['assessment', 'technicalSkills']}
                label="Technical Skills"
                rules={[{ required: true, message: 'Please rate technical skills' }]}
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['assessment', 'initiative']}
                label="Initiative"
                rules={[{ required: true, message: 'Please rate initiative' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name={['assessment', 'attendance']}
                label="Attendance Record"
                rules={[{ required: true, message: 'Please rate attendance record' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name={['assessment', 'goalAchievement']}
                label="Goal Achievement"
                rules={[{ required: true, message: 'Please rate goal achievement' }]}
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="comments"
            label="Qualitative Feedback"
          >
            <TextArea rows={4} placeholder="Provide detailed feedback on employee performance" />
          </Form.Item>

          <Form.Item
            name="goals"
            label="Goals for Next Period"
          >
            <TextArea rows={2} placeholder="Set goals for the next review period" />
          </Form.Item>

          <Form.Item
            name="strengths"
            label="Strengths"
          >
            <TextArea rows={2} placeholder="List employee strengths" />
          </Form.Item>

          <Form.Item
            name="areasForImprovement"
            label="Areas for Improvement"
          >
            <TextArea rows={2} placeholder="List areas where employee can improve" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingReview ? 'Update Review' : 'Create Review'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default PerformanceManagement;