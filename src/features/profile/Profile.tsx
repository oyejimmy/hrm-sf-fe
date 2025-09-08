import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Tag,
  Button,
  Statistic,
  Progress,
  Descriptions,
  List,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Option } = Select;

// Styles
const PageWrapper = styled.div`
  padding: 24px;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h3`
  margin: 8px 0;
  font-weight: 600;
  color: #333;
`;

// Mock user data
const initialUser = {
  name: "Jamil Ur Rahman",
  designation: "Software Engineer",
  department: "Frontend",
  employeeId: "EMP-1023",
  status: "Active",
  email: "jamil@example.com",
  phone: "+92 300 1234567",
  address: "Islamabad, Pakistan",
  joiningDate: "2022-05-10",
  skills: ["React", "TypeScript", "Redux", "UI/UX"],
  resume: "resume.pdf",
};

const EmployeeProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);

  // Modal states
  const [isPersonalModalVisible, setPersonalModalVisible] = useState(false);
  const [isJobModalVisible, setJobModalVisible] = useState(false);
  const [isSkillsModalVisible, setSkillsModalVisible] = useState(false);

  const [form] = Form.useForm();

  // Handlers
  const handlePersonalEdit = () => {
    form.setFieldsValue({
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setPersonalModalVisible(true);
  };

  const handleJobEdit = () => {
    form.setFieldsValue({
      designation: user.designation,
      department: user.department,
      joiningDate: user.joiningDate,
      employeeId: user.employeeId,
    });
    setJobModalVisible(true);
  };

  const handleSkillsEdit = () => {
    form.setFieldsValue({
      skills: user.skills,
      resume: user.resume,
    });
    setSkillsModalVisible(true);
  };

  const handleSave = (values: any, type: "personal" | "job" | "skills") => {
    if (type === "personal") {
      setUser({ ...user, ...values });
      setPersonalModalVisible(false);
    } else if (type === "job") {
      setUser({
        ...user,
        designation: values.designation,
        department: values.department,
        joiningDate: values.joiningDate?.format("YYYY-MM-DD") || user.joiningDate,
        employeeId: values.employeeId,
      });
      setJobModalVisible(false);
    } else if (type === "skills") {
      setUser({
        ...user,
        skills: values.skills || user.skills,
        resume: values.resume || user.resume,
      });
      setSkillsModalVisible(false);
    }
  };

  return (
    <PageWrapper>
      {/* Profile Header */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <div>
            <h2>{user.name}</h2>
            <p>
              {user.designation} — {user.department}
            </p>
            <p>
              Employee ID: <b>{user.employeeId}</b>
            </p>
            <Tag color={user.status === "Active" ? "green" : "red"}>
              {user.status}
            </Tag>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Personal Info */}
        <Col xs={24} md={12}>
          <SectionTitle>Personal Information</SectionTitle>
          <Card
            extra={
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={handlePersonalEdit}
              >
                Edit
              </Button>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Job Info */}
        <Col xs={24} md={12}>
          <SectionTitle>Job & Work Information</SectionTitle>
          <Card
            extra={
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={handleJobEdit}
              >
                Edit
              </Button>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="Designation">
                {user.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {user.department}
              </Descriptions.Item>
              <Descriptions.Item label="Joining Date">
                {user.joiningDate}
              </Descriptions.Item>
              <Descriptions.Item label="Employee ID">
                {user.employeeId}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Skills & Resume */}
      <SectionTitle>Skills & Resume</SectionTitle>
      <Card
        style={{ marginBottom: 16 }}
        extra={
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={handleSkillsEdit}
          >
            Edit
          </Button>
        }
      >
        <List
          header="Skills"
          bordered
          dataSource={user.skills}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          style={{ marginBottom: 16 }}
        />
        <p>
          <FileTextOutlined /> Resume:{" "}
          <a href={`/${user.resume}`} target="_blank" rel="noreferrer">
            {user.resume}
          </a>
        </p>
      </Card>

      {/* HR & Payroll (Restricted) */}
      <SectionTitle>HR & Payroll Info</SectionTitle>
      <Card>
        <p>Restricted view — HR/Admin only</p>
      </Card>

      {/* Attendance & Leave */}
      <SectionTitle>Attendance & Leave Summary</SectionTitle>
      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Attendance %" value={95} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Leaves Taken" value={3} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Remaining Leaves" value={7} />
          </Card>
        </Col>
      </Row>

      {/* Training */}
      <SectionTitle>Training & Development Snapshot</SectionTitle>
      <Card>
        <Progress percent={70} status="active" />
        <p>Ongoing: React Advanced Training</p>
      </Card>

      {/* Documents */}
      <SectionTitle>Documents & Attachments</SectionTitle>
      <Card>
        <List
          dataSource={["ID Card.pdf", "Contract.pdf"]}
          renderItem={(doc) => (
            <List.Item>
              <FileTextOutlined /> {doc}
            </List.Item>
          )}
        />
      </Card>

      {/* Activity Log */}
      <SectionTitle>Activity Log</SectionTitle>
      <Card>
        <List
          dataSource={[
            "Logged in at 09:00 AM",
            "Applied for leave on 5th Sept",
            "Uploaded Contract.pdf",
          ]}
          renderItem={(log) => <List.Item>{log}</List.Item>}
        />
      </Card>

      {/* ================== MODALS ================== */}

      {/* Personal Info Modal */}
      <Modal
        title="Edit Personal Information"
        open={isPersonalModalVisible}
        onCancel={() => setPersonalModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleSave(values, "personal"))
            .catch(() => {});
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Job Info Modal */}
      <Modal
        title="Edit Job Information"
        open={isJobModalVisible}
        onCancel={() => setJobModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleSave(values, "job"))
            .catch(() => {});
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select>
              <Option value="Frontend">Frontend</Option>
              <Option value="Backend">Backend</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="employeeId" label="Employee ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Skills & Resume Modal */}
      <Modal
        title="Edit Skills & Resume"
        open={isSkillsModalVisible}
        onCancel={() => setSkillsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleSave(values, "skills"))
            .catch(() => {});
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="skills" label="Skills">
            <Select mode="tags" style={{ width: "100%" }} tokenSeparators={[","]}>
              {user.skills.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="resume" label="Resume">
            <Upload
              beforeUpload={(file) => {
                message.success(`${file.name} uploaded successfully`);
                form.setFieldsValue({ resume: file.name });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Resume</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </PageWrapper>
  );
};

export default EmployeeProfile;
