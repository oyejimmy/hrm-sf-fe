import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Dropdown,
  Menu,
  message,
  Typography,
  Tooltip,
  Badge
} from 'antd';
import {
  FileSpreadsheet,
  FileText,
  MapPin,
  Building,
  ChevronDown,
  Download,
  Trash2,
  Eye,
  Edit3,
  Plus,
  Calendar,
  CheckSquare,
  XCircle,
  FileText as FileTextIcon,
  Users,
  Clock,
  Search
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import JobFormModal from './components/JobFormModal';
import JobPreviewModal from './components/JobPreviewModal';
import { JobPosting, Department, FilterOptions, RecruitmentStats } from './types';
import { Container, StatsCard, FilterCard, JobsCard } from './styles';
import dayjs from 'dayjs';
import { useTheme } from '../../../contexts/ThemeContext';

const { Text } = Typography;
const { Option } = Select;

const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering', icon: <Building size={16} /> },
  { id: '2', name: 'Marketing', icon: <Users size={16} /> },
  { id: '3', name: 'Sales', icon: <Users size={16} /> },
  { id: '4', name: 'Human Resources', icon: <Users size={16} /> },
  { id: '5', name: 'Finance', icon: <FileText size={16} /> },
  { id: '6', name: 'Operations', icon: <CheckSquare size={16} /> },
];

const mockLocations = [
  'New York, NY',
  'San Francisco, CA',
  'Chicago, IL',
  'Austin, TX',
  'Boston, MA',
  'Seattle, WA',
  'Remote',
  'London, UK',
  'Berlin, Germany',
  'Tokyo, Japan'
];

const mockSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'UI/UX Design',
  'Content Marketing',
  'SEO',
  'Data Analysis',
  'Project Management'
];

const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: [120000, 160000],
    deadline: '2023-06-30',
    status: 'Active',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'UI/UX Design'],
    jobDescription: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing visual elements that users see and interact with in web applications.',
    applications: 24,
    createdAt: '2023-05-15',
    updatedAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    employmentType: 'Full-time',
    experienceLevel: 'Mid',
    salaryRange: [70000, 90000],
    deadline: '2023-07-15',
    status: 'Active',
    requiredSkills: ['Content Marketing', 'SEO', 'Data Analysis'],
    jobDescription: 'We are seeking a Marketing Specialist to develop and implement marketing strategies to promote our products and services.',
    applications: 18,
    createdAt: '2023-05-10',
    updatedAt: '2023-05-10'
  },
  {
    id: '3',
    title: 'HR Coordinator',
    department: 'Human Resources',
    location: 'Chicago, IL',
    employmentType: 'Full-time',
    experienceLevel: 'Entry',
    salaryRange: [50000, 65000],
    deadline: '2023-06-15',
    status: 'Active',
    requiredSkills: ['Recruitment', 'Onboarding', 'Employee Relations'],
    jobDescription: 'We are looking for an HR Coordinator to support our Human Resources department in various administrative tasks.',
    applications: 32,
    createdAt: '2023-05-05',
    updatedAt: '2023-05-05'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Contract',
    experienceLevel: 'Senior',
    salaryRange: [100000, 140000],
    deadline: '2023-07-31',
    status: 'Active',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    jobDescription: 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure and deployment pipelines.',
    applications: 15,
    createdAt: '2023-05-01',
    updatedAt: '2023-05-01'
  },
  {
    id: '5',
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    experienceLevel: 'Junior',
    salaryRange: [55000, 75000],
    deadline: '2023-06-01',
    status: 'Inactive',
    requiredSkills: ['Sales', 'Customer Relations', 'CRM'],
    jobDescription: 'We are looking for a Sales Representative to join our team and help us grow our customer base.',
    applications: 8,
    createdAt: '2023-04-20',
    updatedAt: '2023-04-20'
  },
  {
    id: '6',
    title: 'Financial Analyst',
    department: 'Finance',
    location: 'Boston, MA',
    employmentType: 'Part-time',
    experienceLevel: 'Mid',
    salaryRange: [60000, 80000],
    deadline: '2023-07-01',
    status: 'Active',
    requiredSkills: ['Financial Modeling', 'Excel', 'Data Analysis'],
    jobDescription: 'We are seeking a Financial Analyst to help us with financial planning and analysis.',
    applications: 12,
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15'
  },
];

// Status colors
const statusColors: Record<string, string> = {
  Active: 'green',
  Inactive: 'red'
};

// Experience level colors
const experienceColors: Record<string, string> = {
  Entry: 'blue',
  Junior: 'cyan',
  Mid: 'geekblue',
  Senior: 'purple'
};

const employmentIcons: Record<string, React.ReactNode> = {
  'Full-time': <CheckSquare size={12} />,
  'Part-time': <Clock size={12} />,
  'Contract': <FileTextIcon size={12} />
};

// Main Component
const Recruitments: React.FC = () => {
  const {isDarkMode} = useTheme()
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(mockJobPostings);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [stats, setStats] = useState<RecruitmentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    totalApplications: 0
  });

  // Calculate statistics
  useEffect(() => {
    const total = jobPostings.length;
    const active = jobPostings.filter(job => job.status === 'Active').length;
    const inactive = jobPostings.filter(job => job.status === 'Inactive').length;
    const totalApplications = jobPostings.reduce((sum, job) => sum + job.applications, 0);

    setStats({
      total,
      active,
      inactive,
      totalApplications
    });
  }, [jobPostings]);

  // Apply filters and search
  useEffect(() => {
    let result = jobPostings;

    // Apply filters
    if (filters.department) {
      result = result.filter(job => job.department === filters.department);
    }

    if (filters.employmentType) {
      result = result.filter(job => job.employmentType === filters.employmentType);
    }

    if (filters.experienceLevel) {
      result = result.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.status) {
      result = result.filter(job => job.status === filters.status);
    }

    if (filters.location) {
      result = result.filter(job => job.location === filters.location);
    }

    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter(job => {
        const jobDate = new Date(job.createdAt);
        return jobDate >= filters.dateRange![0].toDate() &&
          jobDate <= filters.dateRange![1].toDate();
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply department filter from dropdown
    if (selectedDepartment !== 'All') {
      result = result.filter(job => job.department === selectedDepartment);
    }

    // Apply status filter from dropdown
    if (selectedStatus !== 'All') {
      result = result.filter(job => job.status === selectedStatus);
    }

    setFilteredJobs(result);
  }, [filters, searchQuery, jobPostings, selectedDepartment, selectedStatus]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...job,
      deadline: dayjs(job.deadline).format('YYYY-MM-DD'),
      salaryRange: job.salaryRange
    });
  };

  const handleDeleteJob = (id: string) => {
    Modal.confirm({
      title: 'Delete Job Posting',
      content: 'Are you sure you want to delete this job posting? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setJobPostings(prev => prev.filter(job => job.id !== id));
        message.success('Job posting deleted successfully');
      }
    });
  };

  const handleFormSubmit = (values: any) => {
    const jobData = {
      ...values,
      salaryRange: values.salaryRange,
      deadline: values.deadline.format('YYYY-MM-DD'),
      applications: editingJob ? editingJob.applications : 0,
      createdAt: editingJob ? editingJob.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingJob) {
      // Update existing job
      setJobPostings(prev => prev.map(job => job.id === editingJob.id ?
        { ...job, ...jobData } : job));
      message.success('Job posting updated successfully');
    } else {
      // Add new job
      const newJob: JobPosting = {
        ...jobData,
        id: Date.now().toString(),
      };
      setJobPostings(prev => [...prev, newJob]);
      message.success('Job posting created successfully');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handlePreview = (job: JobPosting) => {
    setEditingJob(job);
    setIsPreviewVisible(true);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one job posting to delete');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Job Postings',
      content: `Are you sure you want to delete ${selectedRowKeys.length} job postings? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setJobPostings(prev => prev.filter(job => !selectedRowKeys.includes(job.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} job postings deleted successfully`);
      }
    });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    message.success(`Exporting ${filteredJobs.length} job postings as ${format.toUpperCase()}`);
    // In a real application, you would implement the actual export logic here
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const departmentMenu = (
    <Menu onClick={({ key }) => handleDepartmentChange(key)}>
      <Menu.Item key="All">All Departments</Menu.Item>
      {mockDepartments.map(dept => (
        <Menu.Item key={dept.name}>{dept.name}</Menu.Item>
      ))}
    </Menu>
  );

  const statusMenu = (
    <Menu onClick={({ key }) => handleStatusChange(key)}>
      <Menu.Item key="All">All Statuses</Menu.Item>
      <Menu.Item key="Active">Active</Menu.Item>
      <Menu.Item key="Inactive">Inactive</Menu.Item>
    </Menu>
  );

  const exportMenu = (
    <Menu onClick={({ key }) => handleExport(key as 'csv' | 'pdf')}>
      <Menu.Item key="csv" icon={<FileSpreadsheet size={16} />}>Export as CSV</Menu.Item>
      <Menu.Item key="pdf" icon={<FileText size={16} />}>Export as PDF</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: JobPosting) => (
        <Space direction="vertical" size={2}>
          <Text strong>{text}</Text>
          <Space size={4}>
            <Building size={14} />
            <Text type="secondary">{record.department}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <MapPin size={14} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Applications',
      dataIndex: 'applications',
      key: 'applications',
      render: (count: number, record: JobPosting) => (
        <Tooltip title={`${count} applications`}>
          <Badge count={count} showZero={false} style={{ backgroundColor: '#3b82f6' }} />
        </Tooltip>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
      render: (level: string) => (
        <Tag color={experienceColors[level]}>{level}</Tag>
      ),
    },
    {
      title: 'Employment Type',
      dataIndex: 'employmentType',
      key: 'employmentType',
      render: (type: string) => (
        <Tag icon={employmentIcons[type]}>{type}</Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => (
        <Space>
          <Calendar size={14} />
          {new Date(date).toLocaleDateString()}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {status === 'Active' ? <CheckSquare size={12} /> : <XCircle size={12} />}
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: JobPosting) => (
        <Space size="middle">
          <Button
            icon={<Eye size={16} />}
            onClick={() => handlePreview(record)}
          >
            View
          </Button>
          <Button
            icon={<Edit3 size={16} />}
            onClick={() => handleEditJob(record)}
          >
            Edit
          </Button>
          <Button
            icon={<Trash2 size={16} />}
            danger
            onClick={() => handleDeleteJob(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <PageHeader
      isDarkMode={isDarkMode}
        title="Recruitment Management"
        subtitle="Manage job postings and recruitment process"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
        extraButtons={[
          <Button
            key="new-job"
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddJob}
          >
            New Job
          </Button>
        ]}
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatsCard>
            <Statistic
              title="Total Job Postings"
              value={stats.total}
              prefix={<FileTextIcon size={20} />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </StatsCard>
        </Col>
        <Col span={6}>
          <StatsCard>
            <Statistic
              title="Active Postings"
              value={stats.active}
              prefix={<CheckSquare size={20} />}
              valueStyle={{ color: '#10b981' }}
            />
          </StatsCard>
        </Col>
        <Col span={6}>
          <StatsCard>
            <Statistic
              title="Total Applications"
              value={stats.totalApplications}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </StatsCard>
        </Col>
        <Col span={6}>
          <StatsCard>
            <Statistic
              title="Inactive Postings"
              value={stats.inactive}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatsCard>
        </Col>
      </Row>

      <FilterCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search jobs, departments, skills..."
              prefix={<Search size={16} />}
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Dropdown overlay={departmentMenu} trigger={['click']}>
              <Button style={{ width: '100%' }}>
                Department: {selectedDepartment} <ChevronDown size={14} />
              </Button>
            </Dropdown>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Dropdown overlay={statusMenu} trigger={['click']}>
              <Button style={{ width: '100%' }}>
                Status: {selectedStatus} <ChevronDown size={14} />
              </Button>
            </Dropdown>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Employment Type"
              style={{ width: '100%' }}
              allowClear
              onChange={value => handleFilterChange('employmentType', value)}
            >
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Contract">Contract</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Dropdown overlay={exportMenu} trigger={['click']}>
                <Button icon={<Download size={16} />}>
                  Export
                </Button>
              </Dropdown>
              {selectedRowKeys.length > 0 && (
                <Button
                  icon={<Trash2 size={16} />}
                  danger
                  onClick={handleBulkDelete}
                >
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </FilterCard>

      <JobsCard
        title="Job Postings"
        extra={
          <Text>
            Showing {filteredJobs.length} of {jobPostings.length} jobs
          </Text>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredJobs}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{ pageSize: 5 }}
        />
      </JobsCard>

      <JobFormModal
        visible={isModalVisible}
        editingJob={editingJob}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleFormSubmit}
        form={form}
      />

      <JobPreviewModal
        visible={isPreviewVisible}
        job={editingJob}
        onCancel={() => setIsPreviewVisible(false)}
        onEdit={() => {
          setIsPreviewVisible(false);
          setIsModalVisible(true);
        }}
      />
    </Container>
  );
};

export default Recruitments;
