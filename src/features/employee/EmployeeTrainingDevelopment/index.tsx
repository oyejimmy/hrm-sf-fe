import React, { useState, useEffect } from "react";
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
  Collapse,
} from "antd";
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
} from "lucide-react";
import styled, { createGlobalStyle } from "styled-components";
import { useTheme } from "../../../contexts/ThemeContext";
import { Wrapper } from "../../../components/Wrapper";
import HeaderComponent from "../../../components/PageHeader";
import { 
  useMyTrainings,
  useTrainingPrograms,
  useEnrollInTraining,
  useUpdateTrainingProgress,
  useCompleteTraining
} from "../../../hooks/api/useTraining";

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
  background: ${(props) => (props.$color ? `${props.$color}15` : "#1890ff15")};
  color: ${(props) => props.$color || "#1890ff"};
  margin-right: 12px;
  width: ${(props) => props.$size || "40px"};
  height: ${(props) => props.$size || "40px"};
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
interface TrainingModuleCardProps {
  program: any;
  enrollment?: any;
  onEnroll: (id: number) => void;
  onResume: (id: number) => void;
  onViewCertificate: (id: number) => void;
}

const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  program,
  enrollment,
  onEnroll,
  onResume,
  onViewCertificate,
}) => {
  const status = enrollment ? enrollment.status : "not_started";
  const progress = enrollment ? enrollment.progress_percentage : 0;

  const getStatusIcon = () => {
    switch (status) {
      case "enrolled":
      case "not_started":
        return <BookOpen size={16} />;
      case "in_progress":
        return <Loader size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "enrolled":
      case "not_started":
        return "default";
      case "in_progress":
        return "blue";
      case "completed":
        return "green";
      default:
        return "default";
    }
  };

  const getTypeIcon = () => {
    return <BookOpen size={16} />;
  };

  const renderActionButton = () => {
    switch (status) {
      case "not_started":
        return (
          <Button
            type="primary"
            icon={<Play size={14} />}
            onClick={() => onEnroll(program.id)}
          >
            Enroll
          </Button>
        );
      case "enrolled":
      case "in_progress":
        return (
          <Button
            type="default"
            icon={<Play size={14} />}
            onClick={() => onResume(program.id)}
          >
            Resume
          </Button>
        );
      case "completed":
        return (
          <Button
            type="default"
            icon={<Award size={14} />}
            onClick={() => onViewCertificate(program.id)}
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", marginBottom: "12px" }}>
          <div
            style={{
              width: "100px",
              height: "60px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              marginRight: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getTypeIcon()}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                {program.title}
              </Title>
              <StatusTag color={getStatusColor()} icon={getStatusIcon()}>
                {status.replace("_", " ")}
              </StatusTag>
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              By {program.instructor || "TBD"} • {program.duration_hours}h • {program.category}
            </Text>
          </div>
        </div>

        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ fontSize: "14px", marginBottom: "12px" }}
        >
          {program.description}
        </Paragraph>

        {status !== "not_started" && enrollment && (
          <ProgressContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Progress
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {progress}%
              </Text>
            </div>
            <Progress
              percent={progress}
              size="small"
              status={status === "completed" ? "success" : "active"}
            />
          </ProgressContainer>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tag icon={<Clock size={12} />}>{program.duration_hours}h</Tag>
            <Tag icon={<User size={12} />}>{program.level}</Tag>
            {program.is_mandatory && <Tag color="orange">Mandatory</Tag>}
          </div>
          {renderActionButton()}
        </div>
      </div>
    </StyledCard>
  );
};



const certifications: any = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issueDate: "2023-06-15",
    expiryDate: "2025-06-15",
    status: "active",
  },
  {
    id: "2",
    title: "Google Cloud Professional Developer",
    issueDate: "2023-03-10",
    expiryDate: "2025-03-10",
    status: "active",
  },
  {
    id: "3",
    title: "React Developer Certification",
    issueDate: "2022-11-20",
    expiryDate: "2024-11-20",
    status: "active",
  },
];

const learningPaths: any = [
  {
    id: "1",
    title: "Frontend Developer Path",
    description:
      "Become a proficient frontend developer with this comprehensive learning path",
    courses: 8,
    duration: "60 hours",
    progress: 60,
  },
  {
    id: "2",
    title: "Cloud Architect Path",
    description:
      "Master cloud architecture concepts and implementation strategies",
    courses: 10,
    duration: "80 hours",
    progress: 25,
  },
  {
    id: "3",
    title: "Leadership Development Path",
    description: "Develop essential leadership skills for management roles",
    courses: 6,
    duration: "40 hours",
    progress: 0,
  },
];

// Main Component
const EmployeeTrainingDevelopment = () => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<any>("all");
  const [searchText, setSearchText] = useState<any>("");
  const [filteredPrograms, setFilteredPrograms] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("all");

  // API hooks
  const { data: programs = [], isLoading: programsLoading } = useTrainingPrograms();
  const { data: myTrainings = [], isLoading: trainingsLoading } = useMyTrainings();
  const enrollMutation = useEnrollInTraining();
  const updateProgressMutation = useUpdateTrainingProgress();
  const completeMutation = useCompleteTraining();

  const handleEnroll = (programId: number) => {
    enrollMutation.mutate({ program_id: programId });
  };

  const handleResume = (programId: number) => {
    const program = programs.find((p: any) => p.id === programId);
    message.info(`Resuming course: ${program?.title}`);
    // Navigate to course content (would be implemented in a real app)
  };

  const handleViewCertificate = (programId: number) => {
    const program = programs.find((p: any) => p.id === programId);
    message.success(`Viewing certificate for: ${program?.title}`);
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
    let filtered = programs.map((program: any) => {
      const enrollment = myTrainings.find((t: any) => t.program_id === program.id);
      return { ...program, enrollment };
    });

    // Filter by search text
    if (search) {
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(search.toLowerCase()) ||
          program.description?.toLowerCase().includes(search.toLowerCase()) ||
          program.instructor?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((program) => program.category === category);
    }

    // Filter by tab (enrollment status)
    if (tab !== "all") {
      if (tab === "not_started") {
        filtered = filtered.filter((program) => !program.enrollment);
      } else {
        filtered = filtered.filter((program) => program.enrollment?.status === tab);
      }
    }

    setFilteredPrograms(filtered);
  };

  useEffect(() => {
    if (programs.length > 0) {
      filterData(searchText, selectedCategory, selectedTab);
    }
  }, [programs, myTrainings, searchText, selectedCategory, selectedTab]);

  const categories = [
    "all",
    ...Array.from(new Set(programs.map((p: any) => p.category))),
  ];

  const enrolledCount = myTrainings.length;
  const completedCount = myTrainings.filter((t: any) => t.status === "completed").length;
  const totalHours = myTrainings.reduce((sum: number, t: any) => {
    const program = programs.find((p: any) => p.id === t.program_id);
    return sum + (program?.duration_hours || 0);
  }, 0);

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Training & Development"
        subtitle="Manage your Training & Development"
        breadcrumbItems={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Training & Development",
          },
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#1890ff">
                <BookOpen size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Enrolled Courses</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {enrolledCount}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#52c41a">
                <CheckCircle size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Completed</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {completedCount}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#faad14">
                <Award size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Certifications</Text>
                <Title level={3} style={{ margin: 0 }}>
                  3
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#ff4d4f">
                <Clock size={20} />
              </IconWrapper>
              <div>
                <Text type="secondary">Learning Hours</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {Math.round(totalHours)}
                </Title>
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
                  <Select
                    defaultValue="all"
                    style={{ width: 180 }}
                    onChange={handleCategoryFilter}
                  >
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </Option>
                    ))}
                  </Select>
                  <Button icon={<Filter size={14} />}>More Filters</Button>
                </Space>
              </div>
            </FilterSection>
            <Row gutter={[16, 16]}>
              {filteredPrograms.map((program: any) => (
                <Col xs={24} md={12} key={program.id}>
                  <TrainingModuleCard
                    program={program}
                    enrollment={program.enrollment}
                    onEnroll={handleEnroll}
                    onResume={handleResume}
                    onViewCertificate={handleViewCertificate}
                  />
                </Col>
              ))}
            </Row>

            {filteredPrograms.length === 0 && !programsLoading && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <BookOpen
                  size={48}
                  style={{
                    color: "var(--text-color-secondary)",
                    marginBottom: "16px",
                  }}
                />
                <Title
                  level={4}
                  style={{ color: "var(--text-color-secondary)" }}
                >
                  No courses found
                </Title>
                <Text type="secondary">
                  Try adjusting your search or filters
                </Text>
              </div>
            )}
          </StyledCard>
        </Col>

        <Col xs={24} lg={8}>
          <StyledCard title="Learning Paths" extra={<Lightbulb size={16} />}>
            {learningPaths.map((path: any) => (
              <div
                key={path.id}
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    {path.title}
                  </Title>
                  <Tag icon={<Route size={12} />}>{path.courses} courses</Tag>
                </div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  {path.description}
                </Text>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {path.duration}
                  </Text>
                  {path.progress > 0 ? (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {path.progress}% complete
                    </Text>
                  ) : (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Not started
                    </Text>
                  )}
                </div>
                <Progress percent={path.progress} size="small" />
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, marginTop: "8px" }}
                >
                  View Path <ArrowRight size={14} />
                </Button>
              </div>
            ))}
          </StyledCard>

          <StyledCard
            title="Certifications"
            extra={<Award size={16} />}
            style={{ marginTop: "16px" }}
          >
            {certifications.map((cert: any) => (
              <div
                key={cert.id}
                style={{
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    {cert.title}
                  </Title>
                  <StatusTag color="green">Active</StatusTag>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Issued: {cert.issueDate}
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Expires: {cert.expiryDate}
                    </Text>
                  </div>
                  <Button
                    type="text"
                    icon={<Download size={14} />}
                    size="small"
                  >
                    Download
                  </Button>
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
