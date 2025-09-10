import React, { useState } from "react";
import { Button, Tag, Modal, Rate, Progress, Row, Col, Divider, Typography } from "antd";
import { SectionCard } from "./styles";
import type { TrainingProgram } from "../types";
import styled from "styled-components";

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
];

// 🎨 Styled Components
const ScrollContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-radius: 10px;

  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 10px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: #1890ff;
  }

  scrollbar-width: none;
  &:hover {
    scrollbar-width: thin;
    scrollbar-color: #1890ff transparent;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    position: sticky;
    top: 0;
    background: #f5f5f5;
    text-align: left;
    padding: 12px;
    font-weight: 600;
    z-index: 1;
  }

  tbody td {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  h4 {
    margin-bottom: 12px;
  }
  .ant-row {
    margin-bottom: 8px;
  }
`;

const DescriptionRow = styled(Row)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const DescriptionCard = styled.div`
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  height: 100%;
  background-color: #fafafa;
`;

const TrainingPrograms = () => {
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

  return (
    <SectionCard title="Training Programs">
      <ScrollContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Courses</th>
              <th>Category</th>
              <th>Instructor</th>
              <th>Duration</th>
              <th>Enrollment</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainings.slice(0, 5).map((item: any) => (
              <tr key={item.id}>
                <td>{item.course}</td>
                <td>{item.category}</td>
                <td>{item.instructor}</td>
                <td>{item.duration}</td>
                <td>{item.enrollment}</td>
                <td>
                  <Rate disabled defaultValue={item.rating} style={{ fontSize: "14px" }} />
                </td>
                <td>
                  <Tag color={item.status === "Active" ? "green" : "blue"}>{item.status}</Tag>
                </td>
                <td>
                  <Button type="link" onClick={() => showModal(item)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </ScrollContainer>

      {/* 🖼️ Enhanced Modal */}
      <Modal
        centered
        width={800}
        title="Enhanced Program Details & Metadata"
        open={isModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" type="primary" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        {selectedTraining && (
          <>
            {/* Program Metadata */}
            <Section>
              <Divider orientation="left">Program Metadata</Divider>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text strong>Course:</Text><Text> {selectedTraining.course}</Text></Col>
                <Col span={12}><Text strong>Level:</Text><Text> {selectedTraining.courseLevel}</Text></Col>
                <Col span={12}><Text strong>Prerequisites:</Text><Text> {selectedTraining.prerequisites}</Text></Col>
                <Col span={12}><Text strong>Version:</Text><Text> {selectedTraining.version}</Text></Col>
                <Col span={12}><Text strong>Modules/Lessons:</Text><Text> {selectedTraining.totalModules}</Text></Col>
                <Col span={12}><Text strong>Capstone:</Text><Text> {selectedTraining.capstoneProject}</Text></Col>
              </Row>
              
              {/* Three Descriptions in One Row */}
              <DescriptionRow gutter={16}>
                <Col span={8}>
                  <DescriptionCard>
                    <Text strong>Course Description</Text>
                    <br />
                    <Text>{selectedTraining.description}</Text>
                  </DescriptionCard>
                </Col>
                <Col span={8}>
                  <DescriptionCard>
                    <Text strong>Key Topics</Text>
                    <br />
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {selectedTraining.keyTopics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </DescriptionCard>
                </Col>
                <Col span={8}>
                  <DescriptionCard>
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
            <Section>
              <Divider orientation="left">Enrollment & Progress</Divider>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text strong>Status:</Text><Text> {selectedTraining.enrollmentStatus}</Text></Col>
                <Col span={12}><Text strong>Grade:</Text><Text> {selectedTraining.grade}</Text></Col>
                <Col span={12}><Text strong>Time Spent:</Text><Text> {selectedTraining.timeSpent}</Text></Col>
                <Col span={12}><Text strong>Last Accessed:</Text><Text> {selectedTraining.lastAccessed}</Text></Col>
                <Col span={12}><Text strong>Next Lesson:</Text><Text> {selectedTraining.nextLesson}</Text></Col>
                <Col span={12}>
                  <Text strong>Certificate Available: </Text>
                  <Text>{selectedTraining.certificateAvailable ? "Yes" : "No"}</Text>
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Progress: </Text>
                  <Progress percent={selectedTraining.progress} size="small" />
                </Col>
              </Row>
              {selectedTraining.certificateAvailable && (
                <Button type="link" style={{ paddingLeft: 0, marginTop: 8 }}>Download Certificate</Button>
              )}
            </Section>

            {/* Instructor Info */}
            <Section>
              <Divider orientation="left">Instructor & Support</Divider>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text strong>Instructor:</Text><Text> {selectedTraining.instructor}</Text></Col>
                <Col span={12}><Text strong>Rating:</Text><Text> {selectedTraining.instructorRating}</Text></Col>
                <Col span={12}><Text strong>TA(s):</Text><Text> {selectedTraining.teachingAssistants}</Text></Col>
                <Col span={12}><Text strong>Support:</Text><Text> {selectedTraining.supportChannel}</Text></Col>
                <Col span={12}><Text strong>Office Hours:</Text><Text> {selectedTraining.officeHours}</Text></Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Bio: </Text>
                  <Text>{selectedTraining.instructorBio}</Text>
                </Col>
              </Row>
            </Section>

            {/* Logistics */}
            <Section>
              <Divider orientation="left">Logistics & Requirements</Divider>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text strong>Format:</Text><Text> {selectedTraining.format}</Text></Col>
                <Col span={12}><Text strong>Platform:</Text><Text> {selectedTraining.platform}</Text></Col>
                <Col span={24}><Text strong>Software Requirements:</Text><Text> {selectedTraining.softwareRequirements}</Text></Col>
              </Row>
            </Section>
          </>
        )}
      </Modal>
    </SectionCard>
  );
};

export default TrainingPrograms;