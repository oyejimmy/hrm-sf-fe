import React from 'react';
import { Row, Col, Card, Statistic, List, Typography, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FileText, Clock, CheckCircle, Plus } from 'lucide-react';
import { Complaint, User } from '../types';
import { ComplaintItem, StatusTag, PriorityTag, ActionButton } from '../styles';

const { Text, Paragraph } = Typography;

interface EmployeeDashboardProps {
  userComplaints: Complaint[];
  onViewDetails: (complaint: Complaint) => void;
  onSubmitComplaint: () => void;
  formatDate: (dateString: string) => string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  userComplaints,
  onViewDetails,
  onSubmitComplaint,
  formatDate
}) => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Complaints"
              value={userComplaints.length}
              prefix={<FileText style={{ color: '#3b82f6' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="In Progress"
              value={userComplaints.filter(c => c.status === 'in-progress').length}
              prefix={<Clock style={{ color: '#f59e0b' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Resolved"
              value={userComplaints.filter(c => c.status === 'resolved').length}
              prefix={<CheckCircle style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton 
          type="primary" 
          icon={<Plus size={16} />}
          onClick={onSubmitComplaint}
        >
          Submit New Complaint
        </ActionButton>
      </div>

      <List
        dataSource={userComplaints}
        renderItem={item => (
          <ComplaintItem onClick={() => onViewDetails(item)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>{item.title}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    #{item.trackingId}
                  </Text>
                </div>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                  {item.description}
                </Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Space>
                    <StatusTag status={item.status}>
                      {item.status.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </StatusTag>
                    <PriorityTag priority={item.priority}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                    </PriorityTag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </Space>
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(item);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </ComplaintItem>
        )}
      />
    </div>
  );
};

export default EmployeeDashboard;