import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { FormGrid } from "./styles";

const { Option } = Select;

const JobModal = ({ open, onClose, onSave, initialValues }: any) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={initialValues ? "Edit Job Posting" : "Add Job Posting"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Save"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSave}
      >
        <FormGrid>
          <Form.Item
            label="Job Title"
            name="title"
            rules={[{ required: true, message: "Job title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select>
              <Option value="Remote">Remote</Option>
              <Option value="On-site">On-site</Option>
              <Option value="Hybrid">Hybrid</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Employment Type"
            name="employmentType"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Contract">Contract</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Experience Level"
            name="experienceLevel"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Junior">Junior</Option>
              <Option value="Mid">Mid</Option>
              <Option value="Senior">Senior</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Salary Range" name="salaryRange">
            <Input placeholder="e.g. $50k - $70k" />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Open">Open</Option>
              <Option value="Closed">Closed</Option>
              <Option value="Draft">Draft</Option>
            </Select>
          </Form.Item>
        </FormGrid>

        <Form.Item
          label="Required Skills"
          name="skills"
          rules={[{ required: true }]}
        >
          <Select mode="tags" placeholder="Add skills" />
        </Form.Item>

        <Form.Item
          label="Job Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobModal;
