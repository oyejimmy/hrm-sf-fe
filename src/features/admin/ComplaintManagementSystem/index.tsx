import React, { useState } from 'react';
import { Form, message, Typography, Badge, Avatar, Tabs, Space } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { FileText, ClipboardList } from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import SubmitComplaintModal from './components/SubmitComplaintModal';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';
import AnalyticsTab from './components/AnalyticsTab';
import { Container, SectionCard } from './styles';
import { User, Complaint, Comment, ComplaintFormValues } from './types';

const { Text } = Typography;
const { TabPane } = Tabs;

// Mock data and constants

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', role: 'admin', email: 'admin@company.com', department: 'Management' },
  { id: '2', name: 'HR Manager', role: 'hr', email: 'hr@company.com', department: 'Human Resources' },
  { id: '3', name: 'HR Assistant', role: 'hr', email: 'hr.assistant@company.com', department: 'Human Resources' },
  { id: '4', name: 'John Doe', role: 'employee', email: 'john.doe@company.com', department: 'Engineering' },
  { id: '5', name: 'Jane Smith', role: 'employee', email: 'jane.smith@company.com', department: 'Marketing' },
];

const mockComplaints: Complaint[] = [
  {
    id: '1',
    employeeId: '4',
    title: 'Harassment Complaint',
    description: 'I have been experiencing harassment from my team lead during team meetings and one-on-one sessions.',
    category: 'Harassment',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2023-05-15T10:30:00',
    updatedAt: '2023-05-16T14:20:00',
    assignedTo: '2',
    trackingId: 'COMP-2023-001',
    comments: [
      {
        id: '1',
        userId: '2',
        content: 'Thank you for bringing this to our attention. We take such matters very seriously and will investigate promptly.',
        timestamp: '2023-05-15T11:45:00',
        isHR: true
      },
      {
        id: '2',
        userId: '4',
        content: 'Thank you. I appreciate your prompt response.',
        timestamp: '2023-05-15T12:30:00',
        isHR: false
      }
    ]
  },
  {
    id: '2',
    employeeId: '5',
    title: 'Salary Discrepancy',
    description: 'My recent paycheck was significantly less than expected. I believe there might be an error in the calculation.',
    category: 'Compensation',
    priority: 'medium',
    status: 'pending',
    createdAt: '2023-05-14T14:15:00',
    updatedAt: '2023-05-14T14:15:00',
    trackingId: 'COMP-2023-002',
    comments: []
  },
  {
    id: '3',
    employeeId: '4',
    title: 'Workstation Issue',
    description: 'My desk chair is broken and causing back pain. I requested a replacement two weeks ago but haven\'t received any update.',
    category: 'Facilities',
    priority: 'low',
    status: 'resolved',
    createdAt: '2023-05-10T09:45:00',
    updatedAt: '2023-05-12T16:30:00',
    assignedTo: '3',
    trackingId: 'COMP-2023-003',
    comments: [
      {
        id: '3',
        userId: '3',
        content: 'A new ergonomic chair has been ordered and will be delivered to your workstation by tomorrow.',
        timestamp: '2023-05-12T16:30:00',
        isHR: true
      }
    ]
  },
];

const complaintCategories = [
  'Harassment',
  'Discrimination',
  'Compensation',
  'Benefits',
  'Work Environment',
  'Facilities',
  'IT Issues',
  'Workload',
  'Other'
];

// Main Component
const ComplaintManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [complaintForm] = Form.useForm();
  const [commentForm] = Form.useForm();
  const currentUser: User = mockUsers[3]; // Simulate employee user

  // Filter complaints based on user role
  const userComplaints = currentUser.role === 'employee' 
    ? complaints.filter(c => c.employeeId === currentUser.id)
    : complaints;

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  const handleSubmitComplaint = (values: ComplaintFormValues) => {
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      employeeId: currentUser.id,
      title: values.title,
      description: values.description,
      category: values.category,
      priority: values.priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingId: `COMP-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, '0')}`,
      comments: [],
      attachments: values.attachments || [],
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
    setIsComplaintModalVisible(false);
    complaintForm.resetFields();
    
    message.success(
      <span>
        Complaint submitted successfully! Your tracking ID is: <Text strong>{newComplaint.trackingId}</Text>
      </span>
    );
  };

  const handleUpdateStatus = (complaintId: string, status: 'pending' | 'in-progress' | 'resolved') => {
    setComplaints(prev => prev.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, status, updatedAt: new Date().toISOString() }
        : complaint
    ));
    message.success(`Complaint status updated to ${status}`);
  };

  const handleAssignComplaint = (complaintId: string, assigneeId: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, assignedTo: assigneeId, updatedAt: new Date().toISOString() }
        : complaint
    ));
    message.success('Complaint assigned successfully');
  };

  const handleAddComment = (complaintId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      isHR: currentUser.role !== 'employee'
    };
    
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, comments: [...complaint.comments, newComment], updatedAt: new Date().toISOString() }
        : complaint
    ));
    
    commentForm.resetFields();
    message.success('Comment added successfully');
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModalVisible(true);
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToPDF = () => {
    message.info('Exporting to PDF...');
  };

  const exportToExcel = () => {
    message.info('Exporting to Excel...');
  };



  return (
    <Container>
      <HeaderComponent
        title="Complaint Management System"
        subtitle="Manage and track employee complaints"
        extraButtons={[
          <Badge key="notifications" count={pendingComplaints} size="small">
            <Avatar icon={<BellOutlined />} />
          </Badge>,
          <Space key="user-info">
            <Text strong>{currentUser.name}</Text>
            <Avatar icon={<UserOutlined />} />
          </Space>
        ]}
      />
      
      <SectionCard>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            key="dashboard"
            tab={
              <span>
                <FileText size={16} style={{ marginRight: 8 }} />
                {currentUser.role === 'employee' ? 'My Complaints' : 'Dashboard'}
              </span>
            }
          >
            {currentUser.role === 'employee' ? (
              <EmployeeDashboard
                userComplaints={userComplaints}
                onViewDetails={handleViewDetails}
                onSubmitComplaint={() => setIsComplaintModalVisible(true)}
                formatDate={formatDate}
              />
            ) : (
              <HRDashboard
                complaints={complaints}
                pendingComplaints={pendingComplaints}
                inProgressComplaints={inProgressComplaints}
                resolvedComplaints={resolvedComplaints}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
                onAssignComplaint={handleAssignComplaint}
                formatDate={formatDate}
                exportToPDF={exportToPDF}
                exportToExcel={exportToExcel}
              />
            )}
          </TabPane>
          <TabPane
            key="analytics"
            tab={
              <span>
                <ClipboardList size={16} style={{ marginRight: 8 }} />
                Analytics
              </span>
            }
            disabled={currentUser.role === 'employee'}
          >
            <AnalyticsTab />
          </TabPane>
        </Tabs>
      </SectionCard>
      
      <SubmitComplaintModal
        visible={isComplaintModalVisible}
        onCancel={() => setIsComplaintModalVisible(false)}
        onSubmit={handleSubmitComplaint}
        form={complaintForm}
        complaintCategories={complaintCategories}
      />
      
      <ComplaintDetailModal
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        complaint={selectedComplaint}
        currentUser={currentUser}
        mockUsers={mockUsers}
        commentForm={commentForm}
        onAddComment={handleAddComment}
        onUpdateStatus={handleUpdateStatus}
        onAssignComplaint={handleAssignComplaint}
        getUserName={getUserName}
        formatDate={formatDate}
      />
    </Container>
  );
};

export default ComplaintManagementSystem;