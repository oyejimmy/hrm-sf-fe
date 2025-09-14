import React from 'react';
import { Row, Col, Card, Statistic, Table, Button, Space, Dropdown, Menu, Typography } from 'antd';
import { EyeOutlined, MoreOutlined, DownloadOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import { FileText, Clock, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { Complaint, User } from '../types';
import { SectionCard, StatusTag, PriorityTag } from '../styles';

const { Text } = Typography;

interface HRDashboardProps {
  complaints: Complaint[];
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  onViewDetails: (complaint: Complaint) => void;
  onUpdateStatus: (complaintId: string, status: 'pending' | 'in-progress' | 'resolved') => void;
  onAssignComplaint: (complaintId: string, assigneeId: string) => void;
  formatDate: (dateString: string) => string;
  exportToPDF: () => void;
  exportToExcel: () => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({
  complaints,
  pendingComplaints,
  inProgressComplaints,
  resolvedComplaints,
  onViewDetails,
  onUpdateStatus,
  onAssignComplaint,
  formatDate,
  exportToPDF,
  exportToExcel
}) => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Complaints"
              value={complaints.length}
              prefix={<FileText style={{ color: '#3b82f6' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingComplaints}
              prefix={<Clock style={{ color: '#6b7280' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={inProgressComplaints}
              prefix={<AlertCircle style={{ color: '#f59e0b' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={resolvedComplaints}
              prefix={<CheckCircle style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
      </Row>

      <SectionCard
        title="Complaint Management"
        extra={
          <Space>
            <Dropdown overlay={
              <Menu>
                <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={exportToPDF}>
                  Export to PDF
                </Menu.Item>
                <Menu.Item key="excel" icon={<FileExcelOutlined />} onClick={exportToExcel}>
                  Export to Excel
                </Menu.Item>
              </Menu>
            }>
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Dropdown>
            <Button 
              type="primary" 
              icon={<Filter size={16} />}
            >
              Filter
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={complaints}
          rowKey="id"
          columns={[
            {
              title: 'Tracking ID',
              dataIndex: 'trackingId',
              key: 'trackingId',
              render: (id) => <Text strong>{id}</Text>
            },
            {
              title: 'Title',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Category',
              dataIndex: 'category',
              key: 'category',
            },
            {
              title: 'Priority',
              dataIndex: 'priority',
              key: 'priority',
              render: (priority) => (
                <PriorityTag priority={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </PriorityTag>
              )
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <StatusTag status={status}>
                  {status.split('-').map((word: any) => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </StatusTag>
              )
            },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (date) => formatDate(date)
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <Button 
                    icon={<EyeOutlined />} 
                    size="small"
                    onClick={() => onViewDetails(record)}
                  >
                    View
                  </Button>
                  <Dropdown overlay={
                    <Menu>
                      <Menu.Item 
                        key="assign"
                        onClick={() => onAssignComplaint(record.id, '2')}
                      >
                        Assign to Me
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item 
                        key="pending"
                        onClick={() => onUpdateStatus(record.id, 'pending')}
                      >
                        Mark as Pending
                      </Menu.Item>
                      <Menu.Item 
                        key="in-progress"
                        onClick={() => onUpdateStatus(record.id, 'in-progress')}
                      >
                        Mark as In Progress
                      </Menu.Item>
                      <Menu.Item 
                        key="resolved"
                        onClick={() => onUpdateStatus(record.id, 'resolved')}
                      >
                        Mark as Resolved
                      </Menu.Item>
                    </Menu>
                  }>
                    <Button icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </Space>
              )
            }
          ]}
          pagination={{ pageSize: 5 }}
        />
      </SectionCard>
    </div>
  );
};

export default HRDashboard;