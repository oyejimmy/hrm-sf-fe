import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Row,
  Col,
  Button,
  Slider,
  Radio
} from 'antd';
import { JobFormModalProps } from '../types';
import { ModalContent } from '../styles';

const { Option } = Select;
const { TextArea } = Input;

const mockDepartments = [
  { name: 'Engineering' },
  { name: 'Marketing' },
  { name: 'Sales' },
  { name: 'Human Resources' },
  { name: 'Finance' },
  { name: 'Operations' }
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

const JobFormModal: React.FC<JobFormModalProps> = ({
  visible,
  editingJob,
  onCancel,
  onSubmit,
  form
}) => {
  return (
    <Modal
      title={editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      footer={null}
      style={{ top: 20 }}
    >
      <ModalContent>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Job Title"
                rules={[{ required: true, message: 'Please enter a job title' }]}
              >
                <Input placeholder="e.g. Senior Frontend Developer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select a department' }]}
              >
                <Select placeholder="Select department">
                  {mockDepartments.map(dept => (
                    <Option key={dept.name} value={dept.name}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter a location' }]}
              >
                <Select
                  showSearch
                  placeholder="Select location"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.children as string || '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {mockLocations.map(location => (
                    <Option key={location} value={location}>{location}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employmentType"
                label="Employment Type"
                rules={[{ required: true, message: 'Please select employment type' }]}
              >
                <Radio.Group>
                  <Radio value="Full-time">Full-time</Radio>
                  <Radio value="Part-time">Part-time</Radio>
                  <Radio value="Contract">Contract</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="experienceLevel"
                label="Experience Level"
                rules={[{ required: true, message: 'Please select experience level' }]}
              >
                <Select placeholder="Select experience level">
                  <Option value="Entry">Entry Level</Option>
                  <Option value="Junior">Junior</Option>
                  <Option value="Mid">Mid Level</Option>
                  <Option value="Senior">Senior Level</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salaryRange"
                label="Salary Range"
                rules={[{ required: true, message: 'Please set salary range' }]}
              >
                <Slider
                  range
                  min={30000}
                  max={200000}
                  step={5000}
                  tipFormatter={value => `$${value?.toLocaleString()}`}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="Application Deadline"
                rules={[{ required: true, message: 'Please select a deadline' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="requiredSkills"
            label="Required Skills"
            rules={[{ required: true, message: 'Please add at least one skill' }]}
          >
            <Select
              mode="tags"
              placeholder="Add skills"
              style={{ width: '100%' }}
            >
              {mockSkills.map(skill => (
                <Option key={skill} value={skill}>{skill}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="jobDescription"
            label="Job Description"
            rules={[{ required: true, message: 'Please enter a job description' }]}
          >
            <TextArea rows={6} placeholder="Enter detailed job description..." />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button style={{ marginRight: 8 }} onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingJob ? 'Update Job' : 'Create Job'}
            </Button>
          </Form.Item>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default JobFormModal;