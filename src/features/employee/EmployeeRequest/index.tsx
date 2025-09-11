import React, { useState } from 'react';
import { Tabs, message, Row, Col, Statistic, Empty } from 'antd';
import {
  FileTextOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import RequestList from './components/RequestList';
import DocumentList from './components/DocumentList';
import ActivityLogs from './components/ActivityLogs';
import RequestModal from './components/RequestModal';
import { StyledCard, StyledTabs, PrimaryButton } from './components/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { Wrapper } from '../../../components/Wrapper';

interface EmployeeRequestProps {
  isDarkMode: boolean;
}

interface Request {
  id: string;
  type: string;
  subject: string;
  status: string;
  date: string;
  details: string;
  amount?: number;
  documentType?: string;
  startDate?: string;
  endDate?: string;
  equipmentType?: string;
  destination?: string;
  recognitionType?: string;
  approver?: string;
  approverComments?: string;
  priority?: string;
}

interface HRDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
  size: string;
}

interface RequestLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  avatar?: string;
}

const EmployeeRequest = () => {
  const { isDarkMode } = useTheme();
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'loan',
      subject: 'Home Loan Request',
      status: 'pending',
      date: '2023-01-01',
      details: 'Need a loan for home purchase. Planning to buy a new apartment in the city center.',
      amount: 50000,
      priority: 'high'
    },
    {
      id: '2',
      type: 'document',
      subject: 'Salary Slip Request',
      status: 'approved',
      date: '2023-01-05',
      details: 'Request for last 3 months salary slips for bank loan application.',
      documentType: 'Salary Certificate',
      approver: 'John Manager',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'leave',
      subject: 'Annual Leave Request',
      status: 'rejected',
      date: '2023-01-10',
      details: 'Need to take 2 weeks off for family vacation.',
      startDate: '2023-02-01',
      endDate: '2023-02-14',
      approverComments: 'Project deadline during this period. Please reschedule.',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'equipment',
      subject: 'New Laptop Request',
      status: 'approved',
      date: '2023-01-15',
      details: 'Current laptop is outdated and affecting productivity. Need a replacement.',
      equipmentType: 'MacBook Pro 16"',
      approver: 'Sarah HR',
      priority: 'low'
    },
    {
      id: '5',
      type: 'travel',
      subject: 'Business Trip to Conference',
      status: 'pending',
      date: '2023-01-20',
      details: 'Request for travel approval to attend Tech Conference in San Francisco.',
      destination: 'San Francisco, USA',
      priority: 'high'
    },
    {
      id: '6',
      type: 'recognition',
      subject: 'Employee of the Month Nomination',
      status: 'in_progress',
      date: '2023-01-25',
      details: 'Nomination for outstanding performance and contribution to the project.',
      recognitionType: 'Employee of the Month',
      priority: 'medium'
    },
    {
      id: '7',
      type: 'loan',
      subject: 'Car Loan Request',
      status: 'pending',
      date: '2023-02-01',
      details: 'Request for car loan to purchase a new vehicle for commuting.',
      amount: 25000,
      priority: 'medium'
    },
    {
      id: '8',
      type: 'document',
      subject: 'Employment Verification Letter',
      status: 'approved',
      date: '2023-02-05',
      details: 'Need employment verification letter for visa application.',
      documentType: 'Employment Verification',
      approver: 'Michael HR',
      priority: 'high'
    },
    {
      id: '9',
      type: 'equipment',
      subject: 'External Monitor Request',
      status: 'approved',
      date: '2023-02-10',
      details: 'Need an external monitor for better productivity with dual screen setup.',
      equipmentType: '27" 4K Monitor',
      approver: 'David IT',
      priority: 'low'
    }
  ]);

  const [hrDocuments, setHrDocuments] = useState<HRDocument[]>([
    { id: '1', name: 'Company Policy Handbook.pdf', type: 'PDF', uploadDate: '2023-02-01', url: '#', size: '2.4 MB' },
    { id: '2', name: 'HR Procedures Manual.docx', type: 'Word', uploadDate: '2023-02-15', url: '#', size: '1.8 MB' },
    { id: '3', name: 'Employee Benefits Guide.pdf', type: 'PDF', uploadDate: '2023-03-01', url: '#', size: '3.2 MB' },
    { id: '4', name: 'Travel Expense Policy.pdf', type: 'PDF', uploadDate: '2023-03-10', url: '#', size: '1.5 MB' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logs, setLogs] = useState<RequestLog[]>([
    {
      id: '1',
      timestamp: '2023-01-15 10:30:45',
      action: 'CREATE',
      performedBy: 'You',
      details: 'Created equipment request for new laptop',
      avatar: 'https://example.com/avatar1.jpg'
    },
    {
      id: '2',
      timestamp: '2023-01-16 14:22:33',
      action: 'APPROVE',
      performedBy: 'Sarah HR',
      details: 'Approved laptop request',
      avatar: 'https://example.com/avatar2.jpg'
    }
  ]);
  const [userRole, setUserRole] = useState<any>('employee');
  const [activeTab, setActiveTab] = useState<any>('1');

  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'approved', approver: 'Manager Name' }
        : req
    ));

    setLogs([...logs, {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'APPROVE',
      performedBy: userRole,
      details: `Approved request ${requestId}`
    }]);

    message.success('Request approved successfully!');
  };

  const handleReject = (requestId: string, comments: string) => {
    setRequests(requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'rejected', approverComments: comments }
        : req
    ));

    setLogs([...logs, {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'REJECT',
      performedBy: userRole,
      details: `Rejected request ${requestId} with comments: ${comments}`
    }]);

    message.warning('Request rejected.');
  };

  const handleRequestSubmit = async (values: any) => {
    const newRequest: Request = {
      id: (requests.length + 1).toString(),
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      ...values,
    };

    setRequests([...requests, newRequest]);

    setLogs([...logs, {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'CREATE',
      performedBy: 'Employee',
      details: `Created request ${newRequest.id} (${newRequest.type})`
    }]);

    message.success('Request submitted successfully!');
    setIsModalVisible(false);
  };

  const pendingRequests: any = requests.filter((req: any) => req.status === 'pending');
  const approvedRequests: any = requests.filter((req: any) => req.status === 'approved');
  const rejectedRequests: any = requests.filter((req: any) => req.status === 'rejected');

  const stats = {
    total: requests.length,
    pending: pendingRequests.length,
    approved: approvedRequests.length,
    rejected: rejectedRequests.length,
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Employee Requests"
        subtitle="Manage your requests and approvals"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
        extraButtons={[
          <PrimaryButton
            key="new-request"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            New Request
          </PrimaryButton>,
        ]}
      />
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Statistic
              title="Total Requests"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Statistic
              title="Approved"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              valueStyle={{ color: '#f5222d' }}
              prefix={<CloseCircleOutlined />}
            />
          </StyledCard>
        </Col>
      </Row>

      <RequestModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleRequestSubmit}
        isDarkMode={isDarkMode}
      />

      <StyledTabs
        defaultActiveKey="1"
        type="card"
        size="large"
        onChange={setActiveTab}
        isDarkMode={isDarkMode}
      >
        <Tabs.TabPane tab={<span><FileTextOutlined /> My Requests</span>} key="1">
          {activeTab === '1' && (
            <>
              <RequestList
                title="Pending Requests"
                requests={pendingRequests}
                icon={<ClockCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />}
                emptyText="No pending requests"
                onApprove={handleApprove}
                onReject={handleReject}
                userRole={userRole}
                isDarkMode={isDarkMode}
              />

              <RequestList
                title="Approved Requests"
                requests={approvedRequests}
                icon={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
                emptyText="No approved requests"
                onApprove={handleApprove}
                onReject={handleReject}
                userRole={userRole}
                isDarkMode={isDarkMode}
              />

              <RequestList
                title="Rejected Requests"
                requests={rejectedRequests}
                icon={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 8 }} />}
                emptyText="No rejected requests"
                onApprove={handleApprove}
                onReject={handleReject}
                userRole={userRole}
                isDarkMode={isDarkMode}
              />
            </>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab={<span><FileSearchOutlined /> HR Documents</span>} key="2">
          {activeTab === '2' && (
            <DocumentList
              documents={hrDocuments}
              isDarkMode={isDarkMode}
            />
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab={<span><BarChartOutlined /> Activity Logs</span>} key="3">
          {activeTab === '3' && (
            <ActivityLogs
              logs={logs}
              isDarkMode={isDarkMode}
            />
          )}
        </Tabs.TabPane>
      </StyledTabs>
    </Wrapper>
  );
};

export default EmployeeRequest; 