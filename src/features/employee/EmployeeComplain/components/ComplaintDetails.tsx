import React from 'react';
import { Modal, Button, Row, Col, Typography, Space, Card, Tag, Statistic, Divider } from 'antd';
import { CalendarOutlined, UserOutlined, ExclamationCircleOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Complaint } from '../mockData';

const { Title, Text, Paragraph } = Typography;

interface ComplaintDetailsProps {
  complaint: Complaint | null;
  visible: boolean;
  onClose: () => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, visible, onClose }) => {
  if (!complaint) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending': return { icon: <ClockCircleOutlined />, color: 'orange' };
      case 'In Progress': return { icon: <ExclamationCircleOutlined />, color: 'blue' };
      case 'Resolved': return { icon: <CheckCircleOutlined />, color: 'green' };
      case 'Rejected': return { icon: <CloseCircleOutlined />, color: 'red' };
      default: return { icon: <ClockCircleOutlined />, color: 'default' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  return (
    <Modal
      title="Complaint Details"
      open={visible}
      onCancel={onClose}
      footer={<Button type="primary" onClick={onClose}>Close</Button>}
      width={800}
      centered
    >
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>{complaint.subject}</Title>
          <Text type="secondary">ID: {complaint.id}</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title="Status"
                value={complaint.status}
                prefix={getStatusConfig(complaint.status).icon}
                valueStyle={{ color: getStatusConfig(complaint.status).color === 'orange' ? '#fa8c16' : getStatusConfig(complaint.status).color === 'blue' ? '#1890ff' : getStatusConfig(complaint.status).color === 'green' ? '#52c41a' : '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title="Priority"
                value={complaint.priority}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: getPriorityColor(complaint.priority) === 'red' ? '#f5222d' : getPriorityColor(complaint.priority) === 'orange' ? '#fa8c16' : '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic
                title="Type"
                value={complaint.type}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary">Date Submitted</Text>
              <Space>
                <CalendarOutlined />
                <Text strong>{new Date(complaint.dateSubmitted).toLocaleDateString()}</Text>
              </Space>
            </Space>
          </Col>
          {complaint.dateOfIncident && (
            <Col xs={24} sm={12}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Date of Incident</Text>
                <Space>
                  <CalendarOutlined />
                  <Text strong>{new Date(complaint.dateOfIncident).toLocaleDateString()}</Text>
                </Space>
              </Space>
            </Col>
          )}
          {complaint.assignedTo && (
            <Col xs={24} sm={12}>
              <Space direction="vertical" size={4}>
                <Text type="secondary">Assigned To</Text>
                <Space>
                  <UserOutlined />
                  <Text strong>{complaint.assignedTo}</Text>
                </Space>
              </Space>
            </Col>
          )}
        </Row>

        <Divider />

        <div>
          <Title level={5}>Description</Title>
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Paragraph style={{ margin: 0 }}>{complaint.description}</Paragraph>
          </Card>
        </div>

        {complaint.resolution && (
          <>
            <Divider />
            <div>
              <Title level={5}>Resolution</Title>
              <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Paragraph style={{ margin: 0 }}>{complaint.resolution}</Paragraph>
              </Card>
            </div>
          </>
        )}
      </Card>
    </Modal>
  );
};