import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button, Table, Tag, Progress, Space, message, Modal, Form, Input, Select, DatePicker, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, BookOutlined, TrophyOutlined, ClockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useTheme } from "../../../contexts/ThemeContext";
import { Wrapper } from "../../../components/Wrapper";
import HeaderComponent from "../../../components/PageHeader";
import { 
  useTrainingPrograms,
  useTrainingEnrollments,
  useTrainingStats,
  useCreateTrainingProgram,
  useUpdateTrainingProgram,
  useDeleteTrainingProgram
} from "../../../hooks/api/useTraining";

const { Title, Text } = Typography;
const { Option } = Select;

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

const TrainingManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [programModalVisible, setProgramModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [form] = Form.useForm();

  // API hooks
  const { data: programs = [], isLoading: programsLoading } = useTrainingPrograms();
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useTrainingEnrollments();
  const { data: stats } = useTrainingStats();
  const createProgramMutation = useCreateTrainingProgram();
  const updateProgramMutation = useUpdateTrainingProgram();
  const deleteProgramMutation = useDeleteTrainingProgram();

  const loading = programsLoading || enrollmentsLoading;

  const handleCreateProgram = (values: any) => {
    createProgramMutation.mutate(values, {
      onSuccess: () => {
        setProgramModalVisible(false);
        form.resetFields();
      }
    });
  };

  const handleUpdateProgram = (values: any) => {
    if (!editingProgram) return;
    updateProgramMutation.mutate(
      { id: editingProgram.id, data: values },
      {
        onSuccess: () => {
          setProgramModalVisible(false);
          setEditingProgram(null);
          form.resetFields();
        }
      }
    );
  };

  const handleDeleteProgram = (programId: number) => {
    deleteProgramMutation.mutate(programId);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    form.setFieldsValue({
      title: program.title,
      description: program.description,
      category: program.category,
      level: program.level,
      duration_hours: program.duration_hours,
      instructor: program.instructor,
      max_participants: program.max_participants,
      prerequisites: program.prerequisites,
      is_mandatory: program.is_mandatory
    });
    setProgramModalVisible(true);
  };

  const programColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.category} • {record.level}
          </Text>
        </div>
      ),
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      render: (text: string) => text || "TBD",
    },
    {
      title: "Duration",
      dataIndex: "duration_hours",
      key: "duration_hours",
      render: (hours: number) => `${hours}h`,
    },
    {
      title: "Participants",
      dataIndex: "max_participants",
      key: "max_participants",
      render: (max: number) => max || "Unlimited",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Mandatory",
      dataIndex: "is_mandatory",
      key: "is_mandatory",
      render: (isMandatory: boolean) => (
        <Tag color={isMandatory ? "orange" : "default"}>
          {isMandatory ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditProgram(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProgram(record.id)}
          />
        </Space>
      ),
    },
  ];

  const enrollmentColumns = [
    {
      title: "Employee",
      dataIndex: ["employee", "first_name"],
      key: "employee",
      render: (_: any, record: any) => (
        <div>
          <Text strong>
            {record.employee?.first_name} {record.employee?.last_name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.program?.title}
          </Text>
        </div>
      ),
    },
    {
      title: "Program",
      dataIndex: ["program", "title"],
      key: "program",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          enrolled: "blue",
          in_progress: "orange",
          completed: "green",
          dropped: "red",
        };
        return <Tag color={colorMap[status]}>{status.replace("_", " ")}</Tag>;
      },
    },
    {
      title: "Progress",
      dataIndex: "progress_percentage",
      key: "progress_percentage",
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollment_date",
      key: "enrollment_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Training & Development Management"
        subtitle="Manage training programs and employee development"
        breadcrumbItems={[
          {
            title: "Dashboard",
            href: "/admin",
          },
          {
            title: "Training & Development",
          },
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#1890ff">
                <BookOutlined style={{ fontSize: "20px" }} />
              </IconWrapper>
              <div>
                <Text type="secondary">Total Programs</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.total_programs || 0}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#52c41a">
                <TrophyOutlined style={{ fontSize: "20px" }} />
              </IconWrapper>
              <div>
                <Text type="secondary">Active Programs</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.active_programs || 0}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#faad14">
                <UserOutlined style={{ fontSize: "20px" }} />
              </IconWrapper>
              <div>
                <Text type="secondary">Total Enrollments</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.total_enrollments || 0}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconWrapper $color="#ff4d4f">
                <ClockOutlined style={{ fontSize: "20px" }} />
              </IconWrapper>
              <div>
                <Text type="secondary">Completed</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {stats?.completed_trainings || 0}
                </Title>
              </div>
            </div>
          </StyledCard>
        </Col>
      </Row>

      {/* Training Programs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <StyledCard
            title="Training Programs"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingProgram(null);
                  form.resetFields();
                  setProgramModalVisible(true);
                }}
              >
                Add Program
              </Button>
            }
          >
            <Table
              columns={programColumns}
              dataSource={programs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </StyledCard>
        </Col>

        <Col xs={24} lg={8}>
          <StyledCard title="Recent Enrollments">
            <Table
              columns={enrollmentColumns}
              dataSource={enrollments.slice(0, 5)}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </StyledCard>
        </Col>
      </Row>

      {/* Program Modal */}
      <Modal
        title={editingProgram ? "Edit Training Program" : "Create Training Program"}
        open={programModalVisible}
        onCancel={() => {
          setProgramModalVisible(false);
          setEditingProgram(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingProgram ? handleUpdateProgram : handleCreateProgram}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter program title" }]}
          >
            <Input placeholder="Enter program title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter program description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Option value="Software Development">Software Development</Option>
                  <Option value="Leadership">Leadership</Option>
                  <Option value="Data Science">Data Science</Option>
                  <Option value="Soft Skills">Soft Skills</Option>
                  <Option value="Cloud Computing">Cloud Computing</Option>
                  <Option value="Project Management">Project Management</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: "Please select level" }]}
              >
                <Select placeholder="Select level">
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration_hours"
                label="Duration (Hours)"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <InputNumber min={0.5} step={0.5} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_participants" label="Max Participants">
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="instructor" label="Instructor">
            <Input placeholder="Enter instructor name" />
          </Form.Item>

          <Form.Item name="prerequisites" label="Prerequisites">
            <Input.TextArea rows={2} placeholder="Enter prerequisites" />
          </Form.Item>

          <Form.Item name="is_mandatory" valuePropName="checked">
            <input type="checkbox" /> Mandatory Training
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProgram ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setProgramModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
};

export default TrainingManagement;
