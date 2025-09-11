import React, { useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Table,
  Tag,
  Space,
  Descriptions,
  Divider,
  Statistic,
  Row,
  Col,
  Progress,
  Avatar,
  Badge,
  Typography,
  Empty
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../../../contexts/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Styled Components
const PageContainer = styled.div<{ isDarkMode: boolean }>`
  padding: 24px;
  background: ${props => props.isDarkMode ? '#141414' : '#f5f5f5'};
  min-height: 100vh;
`;

const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  
  &:hover {
    box-shadow: ${props => props.isDarkMode 
      ? '0 6px 16px rgba(0, 0, 0, 0.5)' 
      : '0 6px 16px rgba(0, 0, 0, 0.1)'};
  }
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }
`;

const StatCard = styled(StyledCard)`
  text-align: center;
  
  .ant-card-body {
    padding: 20px;
  }
`;

const PrimaryButton = styled(Button)`
  border-radius: 8px;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
    color: white;
  }
`;

const SecondaryButton = styled(Button)<{ isDarkMode: boolean }>`    
  border-radius: 8px;
  font-weight: 500;
  height: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border-color: ${props => props.isDarkMode ? '#434343' : '#d9d9d9'};
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#333'};
  
  &:hover {
    border-color: ${props => props.isDarkMode ? '#1890ff' : '#40a9ff'};
    color: ${props => props.isDarkMode ? '#1890ff' : '#1890ff'};
  }
`;

const StyledModal = styled(Modal)<{ isDarkMode: boolean }>`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    padding: 20px 24px;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-modal-footer {
    border-top: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    padding: 16px 24px;
  }
`;

const FormContainer = styled.div<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  padding: 24px;
  border-radius: 12px;
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
    : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  .ant-form-item {
    margin-bottom: 16px;
  }
  
  .ant-form-item-label > label {
    font-weight: 500;
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  }
`;

// Interfaces
interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  date: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  dateOfIncident?: string;
  attachments?: string[];
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplaintFormData {
  subject: string;
  complaintType: string;
  description: string;
  dateOfIncident?: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: any[];
}

// ComplaintForm Component
const ComplaintForm: React.FC<{ onSubmit: (values: ComplaintFormData) => void; isDarkMode: boolean }> = ({ onSubmit, isDarkMode }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const uploadProps = {
    name: 'file',
    action: '/upload.do',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <FormContainer isDarkMode={isDarkMode}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          complaintType: 'HR',
          priority: 'medium',
        }}
      >
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please enter the subject of your complaint' }]}
        >
          <Input 
            placeholder="e.g., Workplace Harassment, Policy Violation" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="complaintType"
          label="Complaint Type"
          rules={[{ required: true, message: 'Please select a complaint type' }]}
        >
          <Select placeholder="Select type" size="large">
            <Option value="HR">Human Resources</Option>
            <Option value="Management">Management</Option>
            <Option value="TeamLead">Team Lead</Option>
            <Option value="WorkEnvironment">Work Environment</Option>
            <Option value="Discrimination">Discrimination</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please describe your complaint' }]}
        >
          <TextArea 
            rows={6} 
            placeholder="Provide a detailed description of your complaint including relevant details, people involved, and any other important information." 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="dateOfIncident"
          label="Date of Incident (Optional)"
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select a priority' }]}
        >
          <Select placeholder="Select priority" size="large">
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="attachments"
          label="Attachments (Optional)"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} size="large">Upload Supporting Documents</Button>
          </Upload>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Upload any relevant documents, images, or evidence to support your complaint.
          </Text>
        </Form.Item>

        <Divider />

        <Form.Item>
          <PrimaryButton htmlType="submit" size="large" style={{ width: '100%' }}>
            Submit Complaint
          </PrimaryButton>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

// ComplaintHistoryTable Component
const ComplaintHistoryTable: React.FC<{ complaints: Complaint[]; onViewDetails: (complaintId: string) => void; isDarkMode: boolean }> = ({ complaints, onViewDetails, isDarkMode }) => {
  const getStatusTag = (status: string) => {
    let color = 'default';
    let icon = <ClockCircleOutlined />;
    
    if (status === 'Pending') {
      color = 'gold';
      icon = <ClockCircleOutlined />;
    } else if (status === 'In Progress') {
      color = 'blue';
      icon = <BarChartOutlined />;
    } else if (status === 'Resolved') {
      color = 'green';
      icon = <CheckCircleOutlined />;
    } else if (status === 'Rejected') {
      color = 'red';
      icon = <CloseCircleOutlined />;
    }
    
    return (
      <Tag 
        color={color} 
        icon={icon}
        style={{ 
          borderRadius: 12, 
          padding: '4px 8px', 
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {status.toUpperCase()}
      </Tag>
    );
  };

  const getPriorityTag = (priority: string) => {
    let color = 'blue';
    let text = 'MEDIUM';
    
    if (priority === 'high') {
      color = 'red';
      text = 'HIGH';
    } else if (priority === 'low') {
      color = 'green';
      text = 'LOW';
    }
    
    return (
      <Tag color={color} style={{ borderRadius: 12, margin: 0 }}>
        {text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => getPriorityTag(priority),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Complaint) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => onViewDetails(record.id)}
            icon={<EyeOutlined />}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={complaints} 
      rowKey="id" 
      style={{ marginTop: 16 }}
      scroll={{ x: true }}
      locale={{
        emptyText: (
          <Empty
            description="No complaints submitted yet"
            imageStyle={{ height: 60 }}
          />
        )
      }}
    />
  );
};

// ComplaintDetailsModal Component
const ComplaintDetailsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  isDarkMode: boolean;
}> = ({ visible, onClose, complaint, isDarkMode }) => {
  if (!complaint) {
    return null;
  }

  const getStatusTag = (status: string) => {
    let color = 'default';
    let icon = <ClockCircleOutlined />;
    
    if (status === 'Pending') {
      color = 'gold';
      icon = <ClockCircleOutlined />;
    } else if (status === 'In Progress') {
      color = 'blue';
      icon = <BarChartOutlined />;
    } else if (status === 'Resolved') {
      color = 'green';
      icon = <CheckCircleOutlined />;
    } else if (status === 'Rejected') {
      color = 'red';
      icon = <CloseCircleOutlined />;
    }
    
    return (
      <Tag 
        color={color} 
        icon={icon}
        style={{ 
          borderRadius: 12, 
          padding: '4px 8px', 
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {status.toUpperCase()}
      </Tag>
    );
  };

  const getPriorityTag = (priority: string) => {
    let color = 'blue';
    let text = 'MEDIUM';
    
    if (priority === 'high') {
      color = 'red';
      text = 'HIGH';
    } else if (priority === 'low') {
      color = 'green';
      text = 'LOW';
    }
    
    return (
      <Tag color={color} style={{ borderRadius: 12, margin: 0 }}>
        {text}
      </Tag>
    );
  };

  return (
    <StyledModal
      title={<Title level={3} style={{ margin: 0 }}>Complaint Details</Title>}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      isDarkMode={isDarkMode}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Subject">
          <Text strong>{complaint.subject}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Type">{complaint.type}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {getStatusTag(complaint.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Priority">
          {getPriorityTag(complaint.priority)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Submitted">
          {new Date(complaint.date).toLocaleDateString()}
        </Descriptions.Item>
        {complaint.dateOfIncident && (
          <Descriptions.Item label="Date of Incident">
            {new Date(complaint.dateOfIncident).toLocaleDateString()}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Description">
          {complaint.description}
        </Descriptions.Item>
        {complaint.assignedTo && (
          <Descriptions.Item label="Assigned To">
            {complaint.assignedTo}
          </Descriptions.Item>
        )}
        {complaint.resolution && (
          <Descriptions.Item label="Resolution">
            {complaint.resolution}
          </Descriptions.Item>
        )}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <Descriptions.Item label="Attachments">
            <Space direction="vertical">
              {complaint.attachments.map((attachment, index) => (
                <Button 
                  key={index} 
                  icon={<DownloadOutlined />} 
                  type="link"
                >
                  Attachment {index + 1}
                </Button>
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </StyledModal>
  );
};

const EmployeeComplain = () => {
  const { isDarkMode } = useTheme();
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      subject: 'Workplace Harassment',
      type: 'HR',
      status: 'Pending',
      date: '2023-01-15',
      priority: 'high',
      description: 'Detailed description of harassment incident including dates, times, and individuals involved. This is a serious matter that requires immediate attention from HR department.',
      attachments: ['document1.pdf'],
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-01-15T10:30:00Z'
    },
    {
      id: '2',
      subject: 'Policy Violation',
      type: 'Management',
      status: 'Resolved',
      date: '2023-02-01',
      priority: 'medium',
      description: 'Detailed description of policy violation including specific policy sections and evidence of violation. The issue has been successfully resolved after investigation.',
      attachments: ['policy_doc.pdf', 'evidence.jpg'],
      assignedTo: 'HR Manager',
      resolution: 'Issue resolved after discussion with involved parties. Additional training scheduled for team.',
      createdAt: '2023-02-01T14:22:00Z',
      updatedAt: '2023-02-10T09:15:00Z'
    },
    {
      id: '3',
      subject: 'Unsafe Working Conditions',
      type: 'WorkEnvironment',
      status: 'In Progress',
      date: '2023-03-10',
      priority: 'high',
      description: 'Report of unsafe working conditions in the warehouse area. Several employees have expressed concerns about the lack of safety equipment and proper protocols.',
      attachments: ['safety_issue1.jpg', 'safety_issue2.jpg'],
      assignedTo: 'Safety Officer',
      createdAt: '2023-03-10T09:45:00Z',
      updatedAt: '2023-03-12T16:30:00Z'
    },
    {
      id: '4',
      subject: 'Discrimination Complaint',
      type: 'Discrimination',
      status: 'Pending',
      date: '2023-03-15',
      priority: 'high',
      description: 'Formal complaint regarding discriminatory practices in promotion decisions. Provides specific examples and timeline of events.',
      createdAt: '2023-03-15T11:20:00Z',
      updatedAt: '2023-03-15T11:20:00Z'
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isComplaintFormModalVisible, setIsComplaintFormModalVisible] = useState(false);

  const handleComplaintSubmit = (values: any) => {
    const newComplaint: Complaint = {
      id: (complaints.length + 1).toString(),
      subject: values.subject,
      type: values.complaintType,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      priority: values.priority,
      description: values.description,
      dateOfIncident: values.dateOfIncident,
      attachments: values.attachments ? values.attachments.map((a: any) => a.name) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setComplaints([...complaints, newComplaint]);
    message.success('Complaint submitted successfully!');
    setIsComplaintFormModalVisible(false);
  };

  const handleViewDetails = (complaintId: string) => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (complaint) {
      setSelectedComplaint(complaint);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedComplaint(null);
  };

  // Statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length,
  };

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>
          Complaint Management
        </Title>
        <PrimaryButton 
          icon={<PlusOutlined />} 
          onClick={() => setIsComplaintFormModalVisible(true)}
        >
          Submit New Complaint
        </PrimaryButton>
      </div>

      {/* Statistics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard isDarkMode={isDarkMode}>
            <Statistic
              title="Total Complaints"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </StatCard>
        </Col>
        <Col span={6}>
          <StatCard isDarkMode={isDarkMode}>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </StatCard>
        </Col>
        <Col span={6}>
          <StatCard isDarkMode={isDarkMode}>
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BarChartOutlined />}
            />
          </StatCard>
        </Col>
        <Col span={6}>
          <StatCard isDarkMode={isDarkMode}>
            <Statistic
              title="Resolved"
              value={stats.resolved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </StatCard>
        </Col>
      </Row>

      <StyledCard 
        title={<span><FileTextOutlined style={{ marginRight: 8 }} /> Complaint History</span>}
        isDarkMode={isDarkMode}
      >
        <ComplaintHistoryTable 
          complaints={complaints} 
          onViewDetails={handleViewDetails}
          isDarkMode={isDarkMode}
        />
      </StyledCard>

      <StyledModal
        title="Submit a New Complaint"
        visible={isComplaintFormModalVisible}
        onCancel={() => setIsComplaintFormModalVisible(false)}
        footer={null}
        width={700}
        centered
        isDarkMode={isDarkMode}
      >
        <ComplaintForm onSubmit={handleComplaintSubmit} isDarkMode={isDarkMode} />
      </StyledModal>

      <ComplaintDetailsModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        complaint={selectedComplaint}
        isDarkMode={isDarkMode}
      />
    </PageContainer>
  );
};

export default EmployeeComplain;