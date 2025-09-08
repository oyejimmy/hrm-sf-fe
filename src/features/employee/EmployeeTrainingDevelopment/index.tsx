import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Statistic,
  Table,
  List,
  Tag,
  Modal,
  Rate,
  Input,
} from "antd";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import {
  PageWrapper,
  SectionTitle,
  ResourceCard,
  FeedbackWrapper,
} from "./components/styles";
import { BookOutlined, FileTextOutlined } from "@ant-design/icons";
import TrainingModuleCard from "./components/TrainingModuleCard";
import { AnyAaaaRecord } from "dns";

interface TrainingHistory {
  key: number;
  module: string;
  track: string;
  status: "Completed" | "Pending" | "Active";
  completionDate: string;
}

// Mock Data
const overviewData = {
  track: "Frontend Development",
  progress: 65,
  activeModules: 3,
  completedModules: 8,
  nextMilestone: "React Advanced Patterns",
};

const modules: any = [
  {
    id: 1,
    title: "React Basics",
    description: "Learn JSX, components, and props.",
    resources: ["https://react.dev", "Internal Docs"],
    estimatedTime: "5h",
    status: "Completed",
    certification: true,
    deadline: "2024-09-20",
  },
  {
    id: 2,
    title: "State Management with Redux",
    description: "Learn to manage global state efficiently.",
    resources: ["Redux Docs", "Company Video"],
    estimatedTime: "6h",
    status: "Active",
    deadline: "2024-09-25",
  },
  {
    id: 3,
    title: "TypeScript in React",
    description: "Strongly type your React applications.",
    resources: ["TS Handbook", "YouTube Playlist"],
    estimatedTime: "7h",
    status: "Pending",
    deadline: "2024-09-30",
  },
];

const trainingHistory: TrainingHistory[] = [
  {
    key: 1,
    module: "JavaScript Essentials",
    track: "Frontend",
    status: "Completed",
    completionDate: "2024-07-15",
  },
  {
    key: 2,
    module: "Git & Version Control",
    track: "DevOps",
    status: "Completed",
    completionDate: "2024-08-01",
  },
  {
    key: 3,
    module: "React Basics",
    track: "Frontend",
    status: "Completed",
    completionDate: "2024-08-20",
  },
];

// Skill Tracker Data
const skillChartOptions: ApexOptions = {
  chart: { type: "radar" },
  xaxis: { categories: ["React", "TypeScript", "Redux", "Testing", "UI/UX"] },
  stroke: { width: 2 },
  fill: { opacity: 0.3 },
  colors: ["#1890ff"],
};
const skillSeries = [{ name: "Skill Level", data: [80, 70, 65, 50, 60] }];

// Main Component
const EmployeeTrainingDevelopment: React.FC = () => {
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any | null>(
    null
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const historyColumns = [
    { title: "Module", dataIndex: "module", key: "module" },
    { title: "Track", dataIndex: "track", key: "track" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Completed"
            ? "green"
            : status === "Active"
              ? "blue"
              : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      key: "completionDate",
    },
  ];

  return (
    <PageWrapper>
      {/* Training Overview */}
      <SectionTitle>Training Overview</SectionTitle>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Track" value={overviewData.track} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Progress type="circle" percent={overviewData.progress} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Modules" value={overviewData.activeModules} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Modules"
              value={overviewData.completedModules}
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        Next Milestone: <b>{overviewData.nextMilestone}</b>
      </Card>

      {/* Roadmap */}
      <SectionTitle>Assigned Roadmap</SectionTitle>
      <Row gutter={[16, 16]}>
        {modules.map((mod: any) => (
          <Col span={8} key={mod.id}>
            <TrainingModuleCard
              module={mod}
              onFeedback={(selected) => {
                setSelectedModule(selected);
                setFeedbackVisible(true);
              }}
            />
          </Col>
        ))}
      </Row>

      {/* Training History */}
      <SectionTitle>Training History</SectionTitle>
      <Table
        columns={historyColumns}
        dataSource={trainingHistory}
        pagination={{ pageSize: 5 }}
      />

      {/* Deadlines */}
      <SectionTitle>Upcoming Deadlines & Reminders</SectionTitle>
      <List
        dataSource={modules.filter((m: any) => m.deadline)}
        renderItem={(item: any) => (
          <List.Item actions={[<Tag color="blue">Due: {item.deadline}</Tag>]}>
            <List.Item.Meta
              title={item.title}
              description={`Est. Time: ${item.estimatedTime}`}
            />
          </List.Item>
        )}
      />

      {/* Skill Development Tracker */}
      <SectionTitle>Skill Development Tracker</SectionTitle>
      <Card>
        <ReactApexChart
          options={skillChartOptions}
          series={skillSeries}
          type="radar"
          height={350}
        />
      </Card>

      {/* Training Resources */}
      <SectionTitle>Resources Library</SectionTitle>
      <Row gutter={16}>
        <Col span={6}>
          <ResourceCard>
            <BookOutlined /> React Docs
          </ResourceCard>
        </Col>
        <Col span={6}>
          <ResourceCard>
            <BookOutlined /> Redux Guide
          </ResourceCard>
        </Col>
        <Col span={6}>
          <ResourceCard>
            <FileTextOutlined /> Company Templates
          </ResourceCard>
        </Col>
        <Col span={6}>
          <ResourceCard>
            <BookOutlined /> TypeScript Handbook
          </ResourceCard>
        </Col>
      </Row>

      {/* Feedback Modal */}
      <Modal
        title={`Feedback for ${selectedModule?.title}`}
        open={feedbackVisible}
        onCancel={() => setFeedbackVisible(false)}
        onOk={() => {
          console.log({ rating, comment });
          setFeedbackVisible(false);
        }}
      >
        <FeedbackWrapper>
          <Rate value={rating} onChange={setRating} />
          <Input.TextArea
            rows={4}
            placeholder="Leave your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ marginTop: 16 }}
          />
        </FeedbackWrapper>
      </Modal>
    </PageWrapper>
  );
};

export default EmployeeTrainingDevelopment;
