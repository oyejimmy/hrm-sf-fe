import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Rate,
  Row,
  Col,
  Divider,
  Button
} from 'antd';
import { PerformanceReview, Employee, Reviewer, PerformanceModalProps } from '../types';

const { Option } = Select;
const { TextArea } = Input;

const PerformanceModal: React.FC<PerformanceModalProps> = ({
  visible,
  editingReview,
  onCancel,
  onSubmit,
  employees,
  reviewers
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      title={editingReview ? 'Edit Performance Review' : 'Create Performance Review'}
      open={visible}
      width={800}
      onCancel={handleCancel}
      footer={null}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={editingReview || {
          status: 'Draft',
          assessment: {
            communication: 0,
            teamwork: 0,
            problemSolving: 0,
            technicalSkills: 0,
            initiative: 0,
            attendance: 0,
            goalAchievement: 0
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select placeholder="Select employee">
                {employees.map(emp => (
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
                {reviewers.map(reviewer => (
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
          <Button style={{ marginRight: 8 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {editingReview ? 'Update Review' : 'Create Review'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PerformanceModal;