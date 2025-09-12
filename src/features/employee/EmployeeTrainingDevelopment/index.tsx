import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Progress,
  Tag,
  Input,
  Select,
  Tabs,
  Space,
  message,
  Tooltip,
  Collapse
} from 'antd';
import {
  BookOpen,
  Video,
  Play,
  Award,
  Search,
  Filter,
  Loader,
  Lightbulb,
  Route,
  Download,
  Clock,
  User,
  BarChart3,
  Star,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';
import { useTheme } from '../../../contexts/ThemeContext';
import { Wrapper } from '../../../components/Wrapper';
import HeaderComponent from '../../../components/PageHeader';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.span<{ $color?: string; $size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: ${props => props.$color ? `${props.$color}15` : '#1890ff15'};
  color: ${props => props.$color || '#1890ff'};
  margin-right: 12px;
  width: ${props => props.$size || '40px'};
  height: ${props => props.$size || '40px'};
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    .search-section {
      width: 100%;
      margin-bottom: 12px;
    }
    
    .filter-section {
      width: 100%;
    }
  }
`;

const ProgressContainer = styled.div`
  margin: 12px 0;
`;

const StatusTag = styled(Tag)`
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  border: none;
`;

// TrainingModuleCard Component
interface TrainingModule {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  type: 'video' | 'reading' | 'interactive';
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrolled: number;
  thumbnail?: string;
}

interface TrainingModuleCardProps {
  module: TrainingModule;
  onEnroll: (id: string) => void;
  onResume: (id: string) => void;
  onViewCertificate: (id: string) => void;
}

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  module,
  onEnroll,
  onResume,
  onViewCertificate
}) => {
  const getStatusIcon = () => {
    switch (module.status) {
      case 'not_started':
        return <BookOpen size={16} />;
      case 'in_progress':
        return <Loader size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const getStatusColor = () => {
    switch (module.status) {
      case 'not_started':
        return 'default';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'default';
    }
  };

  const getTypeIcon = () => {
    switch (module.type) {
      case 'video':
        return <Video size={16} />;
      case 'reading':
        return <BookOpen size={16} />;
      case 'interactive':
        return <BarChart3 size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const renderActionButton = () => {
    switch (module.status) {
      case 'not_started':
        return (
          <Button
            type="primary"
            icon={<Play size={14} />}
            onClick={() => onEnroll(module.id)}
          >
            Enroll
          </Button>
        );
      case 'in_progress':
        return (
          <Button
            type="default"
            icon={<Play size={14} />}
            onClick={() => onResume(module.id)}
          >
            Resume
          </Button>
        );
      case 'completed':
        return (
          <Button
            type="default"
            icon={<Award size={14} />}
            onClick={() => onViewCertificate(module.id)}
          >
            Certificate
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <StyledCard>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', marginBottom: '12px' }}>
          {module.thumbnail ? (
            <img
              src={module.thumbnail}
              alt={module.title}
              style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '12px' }}
            />
          ) : (
            <div style={{
              width: '100px',
              height: '60px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getTypeIcon()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Title level={5} style={{ margin: 0 }}>{module.title}</Title>
              <StatusTag color={getStatusColor()} icon={getStatusIcon()}>
                {module.status.replace('_', ' ')}
              </StatusTag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              By {module.instructor} • {module.duration} • {module.category}
            </Text>
          </div>
        </div>

        <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', marginBottom: '12px' }}>
          {module.description}
        </Paragraph>

        {module.status !== 'not_started' && (
          <ProgressContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Progress</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{module.progress}%</Text>
            </div>
            <Progress
              percent={module.progress}
              size="small"
              status={module.status === 'completed' ? 'success' : 'active'}
            />
          </ProgressContainer>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tag icon={<Clock size={12} />} >{module.duration}</Tag>
            <Tag icon={<User size={12} />} >{module.enrolled} enrolled</Tag>
            <Tag icon={<Star size={12} />} >{module.rating}/5</Tag>
          </div>
          {renderActionButton()}
        </div>
      </div>
    </StyledCard>
  );
};

// Mock Data
const trainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Advanced React Development',
    description: 'Learn advanced React patterns, state management, and performance optimization techniques.',
    instructor: 'Jane Smith',
    duration: '8 hours',
    category: 'Software Development',
    progress: 0,
    status: 'not_started',
    type: 'video',
    level: 'advanced',
    rating: 4.8,
    enrolled: 245
  },
  {
    id: '2',
    title: 'Leadership Fundamentals',
    description: 'Develop essential leadership skills to effectively manage teams and drive organizational success.',
    instructor: 'Michael Johnson',
    duration: '6 hours',
    category: 'Leadership',
    progress: 45,
    status: 'in_progress',
    type: 'interactive',
    level: 'intermediate',
    rating: 4.6,
    enrolled: 189
  },
  {
    id: '3',
    title: 'Data Visualization with D3.js',
    description: 'Master the art of creating interactive and engaging data visualizations using D3.js library.',
    instructor: 'Sarah Williams',
    duration: '10 hours',
    category: 'Data Science',
    progress: 100,
    status: 'completed',
    type: 'video',
    level: 'intermediate',
    rating: 4.9,
    enrolled: 312
  },
  {
    id: '4',
    title: 'Effective Communication Skills',
    description: 'Improve your communication skills for better workplace collaboration and professional relationships.',
    instructor: 'David Brown',
    duration: '4 hours',
    category: 'Soft Skills',
    progress: 0,
    status: 'not_started',
    type: 'reading',
    level: 'beginner',
    rating: 4.5,
    enrolled: 421
  },
  {
    id: '5',
    title: 'Cloud Infrastructure with AWS',
    description: 'Learn to design, deploy, and manage scalable and reliable applications on AWS cloud platform.',
    instructor: 'Emily Chen',
    duration: '12 hours',
    category: 'Cloud Computing',
    progress: 75,
    status: 'in_progress',
    type: 'interactive',
    level: 'advanced',
    rating: 4.7,
    enrolled: 198
  },
  {
    id: '6',
    title: 'Agile Project Management',
    description: 'Master Agile methodologies to deliver projects efficiently and adapt to changing requirements.',
    instructor: 'Robert Taylor',
    duration: '7 hours',
    category: 'Project Management',
    progress: 100,
    status: 'completed',
    type: 'video',
    level: 'intermediate',
    rating: 4.8,
    enrolled: 276
  }
];

const certifications: any = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect',
    issueDate: '2023-06-15',
    expiryDate: '2025-06-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Google Cloud Professional Developer',
    issueDate: '2023-03-10',
    expiryDate: '2025-03-10',
    status: 'active'
  },
  {
    id: '3',
    title: 'React Developer Certification',
    issueDate: '2022-11-20',
    expiryDate: '2024-11-20',
    status: 'active'
  }
];

const learningPaths: any = [
  {
    id: '1',
    title: 'Frontend Developer Path',
    description: 'Become a proficient frontend developer with this comprehensive learning path',
    courses: 8,
    duration: '60 hours',
    progress: 60
  },
  {
    id: '2',
    title: 'Cloud Architect Path',
    description: 'Master cloud architecture concepts and implementation strategies',
    courses: 10,
    duration: '80 hours',
    progress: 25
  },
  {
    id: '3',
    title: 'Leadership Development Path',
    description: 'Develop essential leadership skills for management roles',
    courses: 6,
    duration: '40 hours',
    progress: 0
  }
];

// Main Component
const EmployeeTrainingDevelopment = () => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<any>('all');
  const [searchText, setSearchText] = useState<any>('');
  const [filteredModules, setFilteredModules] = useState<any>(trainingModules);
  const [selectedTab, setSelectedTab] = useState<any>('all');


  const handleEnroll = (id: any) => {
    message.success(`Enrolled in course: ${trainingModules.find((m: any) => m.id === id)?.title}`);
    // Update module status to in_progress
    setFilteredModules((prev: any) =>
      prev.map((m: any) => m.id === id ? { ...m, status: 'in_progress', progress: 5 } : m)
    );
  };

  const handleResume = (id: any) => {
    message.info(`Resuming course: ${trainingModules.find((m: any) => m.id === id)?.title}`);
    // Navigate to course content (would be implemented in a real app)
  };

  const handleViewCertificate = (id: any) => {
    message.success(`Viewing certificate for: ${trainingModules.find((m: any) => m.id === id)?.title}`);
    // Open certificate modal or page (would be implemented in a real app)
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, selectedCategory, selectedTab);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterData(searchText, category, selectedTab);
  };

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
    filterData(searchText, selectedCategory, key);
  };

  const filterData = (search: string, category: string, tab: string) => {
    let filtered = trainingModules;

    // Filter by search text
    if (search) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase()) ||
        module.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(module => module.category === category);
    }

    // Filter by tab
    if (tab !== 'all') {
      filtered = filtered.filter(module => module.status === tab);
    }

    setFilteredModules(filtered);
  };

  useEffect(() => {
    filterData(searchText, selectedCategory, selectedTab);
  }, []);

  const categories = ['all', 'Software Development', 'Leadership', 'Data Science', 'Soft Skills', 'Cloud Computing', 'Project Management'];

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Training & Development"
        subtitle="Manage your Training & Development"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper $color="#1890ff">
                <BookOpen size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Enrolled Courses</Text>
                <Title level={3} style={{ margin: 0 }}>4</Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper $color="#52c41a">
                <CheckCircle size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Completed</Text>
                <Title level={3} style={{ margin: 0 }}>2</Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper $color="#faad14">
                <Award size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Certifications</Text>
                <Title level={3} style={{ margin: 0 }}>3</Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper $color="#ff4d4f">
                <Clock size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Learning Hours</Text>
                <Title level={3} style={{ margin: 0 }}>26</Title>
              </div>
            </div>
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <StyledCard>
            <Tabs defaultActiveKey="all" onChange={handleTabChange}>
              <TabPane tab="All Courses" key="all" />
              <TabPane tab="Not Started" key="not_started" />
              <TabPane tab="In Progress" key="in_progress" />
              <TabPane tab="Completed" key="completed" />
            </Tabs>

            <FilterSection>
              <div className="search-section">
                <Input
                  placeholder="Search courses..."
                  prefix={<Search size={16} />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 250 }}
                />
              </div>
              <div className="filter-section">
                <Space>
                  <Text>Category:</Text>
                  <Select defaultValue="all" style={{ width: 180 }} onChange={handleCategoryFilter}>
                    {categories.map(category => (
                      <Option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </Option>
                    ))}
                  </Select>
                  <Button icon={<Filter size={14} />}>More Filters</Button>
                </Space>
              </div>
            </FilterSection>
            <Row gutter={[16, 16]}>
              {filteredModules.map((module: any) => (
                <Col xs={24} md={12} key={module.id}>
                  <TrainingModuleCard
                    module={module}
                    onEnroll={handleEnroll}
                    onResume={handleResume}
                    onViewCertificate={handleViewCertificate}
                  />
                </Col>
              ))}
            </Row>

            {filteredModules.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <BookOpen size={48} style={{ color: 'var(--text-color-secondary)', marginBottom: '16px' }} />
                <Title level={4} style={{ color: 'var(--text-color-secondary)' }}>No courses found</Title>
                <Text type="secondary">Try adjusting your search or filters</Text>
              </div>
            )}
          </StyledCard>
        </Col>

        <Col xs={24} lg={8}>
          <StyledCard title="Learning Paths" extra={<Lightbulb size={16} />}>
            {learningPaths.map((path: any) => (
              <div key={path.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Title level={5} style={{ margin: 0 }}>{path.title}</Title>
                  <Tag icon={<Route size={12} />}>{path.courses} courses</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>
                  {path.description}
                </Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{path.duration}</Text>
                  {path.progress > 0 ? (
                    <Text type="secondary" style={{ fontSize: '12px' }}>{path.progress}% complete</Text>
                  ) : (
                    <Text type="secondary" style={{ fontSize: '12px' }}>Not started</Text>
                  )}
                </div>
                <Progress percent={path.progress} size="small" />
                <Button type="link" size="small" style={{ padding: 0, marginTop: '8px' }}>
                  View Path <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </StyledCard>

          <StyledCard title="Certifications" extra={<Award size={16} />} style={{ marginTop: '16px' }}>
            {certifications.map((cert: any) => (
              <div key={cert.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Title level={5} style={{ margin: 0 }}>{cert.title}</Title>
                  <StatusTag color="green">Active</StatusTag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Issued: {cert.issueDate}</Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Expires: {cert.expiryDate}</Text>
                  </div>
                  <Button type="text" icon={<Download size={14} />} size="small">Download</Button>
                </div>
              </div>
            ))}
          </StyledCard>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default EmployeeTrainingDevelopment;