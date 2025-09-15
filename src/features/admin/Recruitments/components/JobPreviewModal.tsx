import React from 'react';
import {
  Modal,
  Button,
  Typography,
  Descriptions,
  Tag,
  Space
} from 'antd';
import { Edit3 } from 'lucide-react';
import { JobPreviewModalProps } from '../types';
import { ModalContent } from '../styles';

const { Title } = Typography;

const statusColors: Record<string, string> = {
  Active: 'green',
  Inactive: 'red'
};

const experienceColors: Record<string, string> = {
  Entry: 'blue',
  Junior: 'cyan',
  Mid: 'geekblue',
  Senior: 'purple'
};

const JobPreviewModal: React.FC<JobPreviewModalProps> = ({
  visible,
  job,
  onCancel,
  onEdit
}) => {
  return (
    <Modal
      title="Job Posting Preview"
      visible={visible}
      width={700}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
        <Button 
          key="edit" 
          type="primary" 
          icon={<Edit3 size={16} />}
          onClick={onEdit}
        >
          Edit Job
        </Button>
      ]}
    >
      <ModalContent>
        {job && (
          <div>
            <Title level={3}>{job.title}</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Department">{job.department}</Descriptions.Item>
              <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
              <Descriptions.Item label="Employment Type">{job.employmentType}</Descriptions.Item>
              <Descriptions.Item label="Experience Level">
                <Tag color={experienceColors[job.experienceLevel]}>{job.experienceLevel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Salary Range">
                ${job.salaryRange[0].toLocaleString()} - ${job.salaryRange[1].toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Application Deadline">
                {new Date(job.deadline).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={statusColors[job.status]}>{job.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Required Skills" span={2}>
                <Space wrap>
                  {job.requiredSkills.map(skill => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Job Description" span={2}>
                {job.jobDescription}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default JobPreviewModal;