import React, { useState } from "react";
import { Button, Tag, Modal, Rate, Progress, Row, Col, Divider, Typography, Table } from "antd";
import { StyledCard } from "./styles";
import type { TrainingProgram } from "../types";
import styled from "styled-components";
import { useTheme } from "../../../../contexts/ThemeContext";
import { GraduationCap } from "lucide-react";

const { Text } = Typography;

// 📝 Extended TrainingProgram type
interface ExtendedTrainingProgram extends TrainingProgram {
  rating: number;
  description: string;
  courseLevel: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string;
  version: string;
  keyTopics: string[];
  totalModules: string;
  capstoneProject: string;

  enrollmentStatus: "Enrolled" | "Not Enrolled" | "Completed" | "In Progress";
  progress: number;
  grade: string;
  timeSpent: string;
  lastAccessed: string;
  nextLesson: string;
  certificateAvailable: boolean;

  instructorBio: string;
  instructorRating: string;
  teachingAssistants: string;
  supportChannel: string;
  officeHours: string;

  format: string;
  platform: string;
  softwareRequirements: string;
  materialsIncluded: string[];
}

// 📊 Mock Data
const trainings: any = [
  {
    id: "t1",
    course: "ReactJS Development Fundamentals",
    category: "Frontend Engineering",
    instructor: "John Doe",
    duration: "20 hours",
    enrollment: "32 enrolled, 18 completed",
    status: "Active",
    rating: 4,
    description:
      "This course provides a solid foundation in ReactJS, covering components, state management, hooks, and best practices for building scalable frontend applications.",
    courseLevel: "Beginner",
    prerequisites: "JavaScript ES6+, HTML, CSS",
    version: "v2.1 (Updated: Oct 26, 2023)",
    keyTopics: ["JSX", "Components & Props", "State & Lifecycle", "Hooks", "React Router", "Context API"],
    totalModules: "8 Modules, 45 Lessons",
    capstoneProject: "Build a Portfolio App",
    enrollmentStatus: "Enrolled",
    progress: 65,
    grade: "92%",
    timeSpent: "12h 45m / 20h",
    lastAccessed: "Yesterday at 3:45 PM",
    nextLesson: "Module 5: Advanced Hooks",
    certificateAvailable: false,
    instructorBio: "John Doe is a senior frontend engineer with 10+ years of experience in React and modern JavaScript.",
    instructorRating: "⭐ 4.8/5 (Based on 120 reviews)",
    teachingAssistants: "Jane Smith",
    supportChannel: "#react-training-support",
    officeHours: "Wednesdays, 2:00 PM - 4:00 PM EST",
    format: "Self-Paced",
    platform: "LinkedIn Learning",
    softwareRequirements: "Node.js v16+, VS Code recommended",
    materialsIncluded: ["Video Lectures", "Code Exercises", "Quizzes", "Slide Decks", "GitHub Repository"],
  },
  {
    id: "t2",
    course: "Node.js Backend Development",
    category: "Backend Engineering",
    instructor: "Sarah Johnson",
    duration: "25 hours",
    enrollment: "28 enrolled, 15 completed",
    status: "Active",
    rating: 5,
    description:
      "Learn to build scalable backend applications with Node.js, Express, and MongoDB. Covers REST APIs, authentication, and deployment.",
    courseLevel: "Intermediate",
    prerequisites: "JavaScript, Basic HTTP knowledge",
    version: "v3.0 (Updated: Nov 15, 2023)",
    keyTopics: ["Express.js", "REST APIs", "MongoDB", "Authentication", "Error Handling", "Deployment"],
    totalModules: "10 Modules, 52 Lessons",
    capstoneProject: "Build a RESTful API for E-commerce",
    enrollmentStatus: "Not Enrolled",
    progress: 0,
    grade: "N/A",
    timeSpent: "0h / 25h",
    lastAccessed: "Never",
    nextLesson: "Module 1: Introduction to Node.js",
    certificateAvailable: true,
    instructorBio: "Sarah Johnson is a backend specialist with 8+ years of experience in Node.js and cloud infrastructure.",
    instructorRating: "⭐ 4.9/5 (Based on 95 reviews)",
    teachingAssistants: "Mike Chen, Lisa Wang",
    supportChannel: "#nodejs-training-support",
    officeHours: "Tuesdays, 4:00 PM - 6:00 PM EST",
    format: "Instructor-Led",
    platform: "Coursera",
    softwareRequirements: "Node.js v18+, MongoDB, Postman",
    materialsIncluded: ["Video Lectures", "Coding Challenges", "Projects", "Community Access"],
  },
  {
    id: "t3",
    course: "Advanced React Patterns",
    category: "Frontend Engineering",
    instructor: "Alex Rodriguez",
    duration: "15 hours",
    enrollment: "18 enrolled, 8 completed",
    status: "Active",
    rating: 4,
    description:
      "Master advanced React patterns and techniques for building highly performant and maintainable applications.",
    courseLevel: "Advanced",
    prerequisites: "React Fundamentals, JavaScript ES6+",
    version: "v1.5 (Updated: Dec 5, 2023)",
    keyTopics: ["Compound Components", "Render Props", "Higher-Order Components", "Custom Hooks", "Performance Optimization"],
    totalModules: "6 Modules, 30 Lessons",
    capstoneProject: "Build a Component Library",
    enrollmentStatus: "Completed",
    progress: 100,
    grade: "96%",
    timeSpent: "15h / 15h",
    lastAccessed: "2 weeks ago",
    nextLesson: "N/A - Course Completed",
    certificateAvailable: true,
    instructorBio: "Alex Rodriguez is a React expert and open-source contributor with extensive experience in enterprise applications.",
    instructorRating: "⭐ 4.7/5 (Based on 67 reviews)",
    teachingAssistants: "Tom Wilson",
    supportChannel: "#advanced-react-support",
    officeHours: "Thursdays, 1:00 PM - 3:00 PM EST",
    format: "Self-Paced",
    platform: "Udemy",
    softwareRequirements: "React 18+, TypeScript knowledge recommended",
    materialsIncluded: ["Video Lectures", "Code Samples", "Cheat Sheets", "Lifetime Access"],
  },
];

// 🎨 Styled Components
const ScrollContainer = styled.div<{ isDarkMode: boolean }>`
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 4px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f1f1f1")};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1890ff;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #40a9ff;
  }

  // Firefox scrollbar
  scrollbar-width: thin;
  scrollbar-color: #1890ff ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f1f1f1")};
`;

const StyledTable = styled(Table) <{ isDarkMode: boolean }>`
  .ant-table-thead > tr > th {
    background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#fafafa")};
    color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "rgba(0, 0, 0, 0.85)")};
    border-bottom: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
    font-weight: 600;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
    background: ${(props) => (props.isDarkMode ? "#1f1f1f" : "#fff")};
    color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "rgba(0, 0, 0, 0.85)")};
  }

  .ant-table-tbody > tr:hover > td {
    background: ${(props) => (props.isDarkMode ? "#2d2d2d" : "#fafafa")};
  }
`;

const Section = styled.div<{ isDarkMode: boolean }>`
  margin-bottom: 20px;
  
  h4 {
    margin-bottom: 12px;
    color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "rgba(0, 0, 0, 0.85)")};
  }
  
  .ant-row {
    margin-bottom: 8px;
  }
`;

const DescriptionRow = styled(Row)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const DescriptionCard = styled.div<{ isDarkMode: boolean }>`
  padding: 16px;
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#f0f0f0")};
  border-radius: 8px;
  height: 100%;
  background-color: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#fafafa")};
  color: ${(props) => (props.isDarkMode ? "#f0f0f0" : "rgba(0, 0, 0, 0.85)")};
`;

// Styled graduation cap icon for the card header
const TrainingIcon = styled(GraduationCap)<{ isDarkMode: boolean }>`
  width: 18px;
  height: 18px;
  color: ${props => props.isDarkMode ? '#f0f0f0' : '#000'};
`;

const TrainingPrograms = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<ExtendedTrainingProgram | null>(null);

  const showModal = (training: ExtendedTrainingProgram) => {
    setSelectedTraining(training);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedTraining(null);
  };

  // Table columns with responsive design
  const columns: any = [
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      responsive: ['md'],
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 100,
      responsive: ['lg'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      responsive: ['sm'],
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: "12px" }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => showModal(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <StyledCard 
      title="Training Programs" 
      $isDarkMode={isDarkMode}
      extra={<TrainingIcon isDarkMode={isDarkMode} />}
    >
      <ScrollContainer isDarkMode={isDarkMode}>
        <StyledTable
          isDarkMode={isDarkMode}
          columns={columns}
          dataSource={trainings}
          pagination={false}
          scroll={{ y: 250 }}
          size="small"
        />
      </ScrollContainer>

      {/* 🖼️ Enhanced Responsive Modal */}
      <Modal
        centered
        width="90%"
        style={{ maxWidth: '800px' }}
        title="Training Program Details"
        open={isModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" type="primary" onClick={handleClose}>
            Close
          </Button>,
        ]}
        styles={{
          body: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            color: isDarkMode ? '#f0f0f0' : 'rgba(0, 0, 0, 0.85)',
            maxHeight: '70vh',
            overflowY: 'auto'
          },
          header: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            borderBottom: `1px solid ${isDarkMode ? '#444' : '#f0f0f0'}`
          },
          footer: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            borderTop: `1px solid ${isDarkMode ? '#444' : '#f0f0f0'}`
          },
          content: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }
        }}
      >
        {selectedTraining && (
          <>
            {/* Program Metadata */}
            <Section isDarkMode={isDarkMode}>
              <Divider orientation="left">Program Metadata</Divider>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12} md={8}><Text strong>Course:</Text><Text> {selectedTraining.course}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Level:</Text><Text> {selectedTraining.courseLevel}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Prerequisites:</Text><Text> {selectedTraining.prerequisites}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Version:</Text><Text> {selectedTraining.version}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Modules/Lessons:</Text><Text> {selectedTraining.totalModules}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Capstone:</Text><Text> {selectedTraining.capstoneProject}</Text></Col>
              </Row>

              {/* Responsive Description Cards */}
              <DescriptionRow gutter={16}>
                <Col xs={24} sm={24} md={8}>
                  <DescriptionCard isDarkMode={isDarkMode}>
                    <Text strong>Course Description</Text>
                    <br />
                    <Text>{selectedTraining.description}</Text>
                  </DescriptionCard>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <DescriptionCard isDarkMode={isDarkMode}>
                    <Text strong>Key Topics</Text>
                    <br />
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {selectedTraining.keyTopics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </DescriptionCard>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <DescriptionCard isDarkMode={isDarkMode}>
                    <Text strong>Materials Included</Text>
                    <br />
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {selectedTraining.materialsIncluded.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </DescriptionCard>
                </Col>
              </DescriptionRow>
            </Section>

            {/* Enrollment Info */}
            <Section isDarkMode={isDarkMode}>
              <Divider orientation="left">Enrollment & Progress</Divider>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12} md={8}><Text strong>Status:</Text><Text> {selectedTraining.enrollmentStatus}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Grade:</Text><Text> {selectedTraining.grade}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Time Spent:</Text><Text> {selectedTraining.timeSpent}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Last Accessed:</Text><Text> {selectedTraining.lastAccessed}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Next Lesson:</Text><Text> {selectedTraining.nextLesson}</Text></Col>
                <Col xs={24} sm={12} md={8}>
                  <Text strong>Certificate Available: </Text>
                  <Text>{selectedTraining.certificateAvailable ? "Yes" : "No"}</Text>
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Progress: </Text>
                  <Progress
                    percent={selectedTraining.progress}
                    size="small"
                    strokeColor={isDarkMode ? '#1890ff' : undefined}
                  />
                </Col>
              </Row>
              {selectedTraining.certificateAvailable && (
                <Button type="link" style={{ paddingLeft: 0, marginTop: 8 }}>Download Certificate</Button>
              )}
            </Section>

            {/* Instructor Info */}
            <Section isDarkMode={isDarkMode}>
              <Divider orientation="left">Instructor & Support</Divider>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12} md={8}><Text strong>Instructor:</Text><Text> {selectedTraining.instructor}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Rating:</Text><Text> {selectedTraining.instructorRating}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>TA(s):</Text><Text> {selectedTraining.teachingAssistants}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Support:</Text><Text> {selectedTraining.supportChannel}</Text></Col>
                <Col xs={24} sm={12} md={8}><Text strong>Office Hours:</Text><Text> {selectedTraining.officeHours}</Text></Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Bio: </Text>
                  <Text>{selectedTraining.instructorBio}</Text>
                </Col>
              </Row>
            </Section>
          </>
        )}
      </Modal>
    </StyledCard>
  );
};

export default TrainingPrograms;