import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Tag,
  Space,
  message,
  Typography,
  List,
  Tabs,
  Upload
} from 'antd';
import {
  BellOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import {
  MessageSquare,
  Bell,
  Megaphone,
  FileText,
  ClipboardList,
  Send,
  Paperclip,
  Download,
  Upload as UploadIcon
} from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import MessageModal from './components/MessageModal';
import AnnouncementModal from './components/AnnouncementModal';
import TaskModal from './components/TaskModal';
import {
  Container,
  SectionCard,
  MessageItem,
  NotificationBadge,
  PriorityTag,
  StatusIndicator,
  ActionButton
} from './styles';
import {
  User,
  Message,
  Notification,
  Announcement,
  Document,
  Task,
  MessageFormValues,
  AnnouncementFormValues,
  TaskFormValues
} from './types';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock data and constants

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', role: 'admin', email: 'admin@company.com', department: 'Management' },
  { id: '2', name: 'HR Manager', role: 'hr', email: 'hr@company.com', department: 'Human Resources' },
  { id: '3', name: 'HR Assistant', role: 'hr', email: 'hr.assistant@company.com', department: 'Human Resources' },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    recipientIds: ['2', '3'],
    content: 'Please review the Q3 performance reports and provide your feedback by Friday.',
    timestamp: '2023-05-15T10:30:00',
    status: 'unread',
    priority: 'high',
    attachments: [
      { id: '1', name: 'Q3_Performance_Report.pdf', type: 'pdf', size: '2.4 MB' }
    ]
  },
  {
    id: '2',
    senderId: '2',
    recipientIds: ['1'],
    content: 'The recruitment drive has been scheduled for next week. Do you have any specific requirements?',
    timestamp: '2023-05-14T14:15:00',
    status: 'read',
    priority: 'medium'
  },
  {
    id: '3',
    senderId: '3',
    recipientIds: ['1', '2'],
    content: 'Reminder: The team meeting is scheduled for tomorrow at 10 AM in Conference Room B.',
    timestamp: '2023-05-13T09:45:00',
    status: 'unread',
    priority: 'low'
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Document Uploaded',
    content: 'Admin User has uploaded a new document: Q3 Performance Report',
    timestamp: '2023-05-15T10:30:00',
    status: 'unread',
    type: 'system',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Task Assigned',
    content: 'You have been assigned a new task: Review Q3 Reports',
    timestamp: '2023-05-14T14:15:00',
    status: 'read',
    type: 'alert',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Meeting Reminder',
    content: 'Reminder: Team meeting tomorrow at 10 AM',
    timestamp: '2023-05-13T09:45:00',
    status: 'unread',
    type: 'reminder',
    priority: 'low'
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance',
    content: 'There will be a system maintenance on Saturday from 2 AM to 4 AM. Please save your work before this time.',
    authorId: '1',
    timestamp: '2023-05-15T10:30:00',
    priority: 'high',
    targetRoles: ['admin', 'hr']
  },
  {
    id: '2',
    title: 'HR Policy Update',
    content: 'The HR policy has been updated. Please review the changes in the employee handbook.',
    authorId: '2',
    timestamp: '2023-05-14T14:15:00',
    priority: 'medium',
    targetRoles: ['hr']
  },
  {
    id: '3',
    title: 'Company Event',
    content: 'The annual company picnic is scheduled for next month. More details to follow.',
    authorId: '1',
    timestamp: '2023-05-13T09:45:00',
    priority: 'low',
    targetRoles: ['admin', 'hr']
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q3_Performance_Report.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploaderId: '1',
    timestamp: '2023-05-15T10:30:00',
    sharedWith: ['2', '3']
  },
  {
    id: '2',
    name: 'Recruitment_Plan.docx',
    type: 'docx',
    size: '1.2 MB',
    uploaderId: '2',
    timestamp: '2023-05-14T14:15:00',
    sharedWith: ['1']
  },
  {
    id: '3',
    name: 'Employee_Handbook.pdf',
    type: 'pdf',
    size: '3.8 MB',
    uploaderId: '2',
    timestamp: '2023-05-13T09:45:00',
    sharedWith: ['1', '3']
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q3 Reports',
    description: 'Review the Q3 performance reports and provide feedback',
    assignerId: '1',
    assigneeId: '2',
    dueDate: '2023-05-19',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Schedule Interviews',
    description: 'Schedule interviews for the new candidates',
    assignerId: '2',
    assigneeId: '3',
    dueDate: '2023-05-22',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Update Employee Handbook',
    description: 'Update the employee handbook with new policies',
    assignerId: '2',
    assigneeId: '2',
    dueDate: '2023-05-25',
    status: 'completed',
    priority: 'low'
  },
];

// Main Component
const CommunicationAndNotification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [isAnnouncementModalVisible, setIsAnnouncementModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [messageForm] = Form.useForm();
  const [announcementForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const currentUser: User = mockUsers[0]; // Assuming current user is admin

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleSendMessage = (values: MessageFormValues) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      recipientIds: values.recipients,
      content: values.content,
      timestamp: new Date().toISOString(),
      status: 'unread',
      priority: values.priority || 'medium',
      attachments: values.attachments || []
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setIsMessageModalVisible(false);
    messageForm.resetFields();
    message.success('Message sent successfully');
  };

  const handleCreateAnnouncement = (values: AnnouncementFormValues) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: values.title,
      content: values.content,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
      priority: values.priority || 'medium',
      targetRoles: values.targetRoles
    };
    
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setIsAnnouncementModalVisible(false);
    announcementForm.resetFields();
    message.success('Announcement created successfully');
  };

  const handleCreateTask = (values: TaskFormValues) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      assignerId: currentUser.id,
      assigneeId: values.assignee,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      status: 'pending',
      priority: values.priority || 'medium'
    };
    
    setTasks(prev => [newTask, ...prev]);
    setIsTaskModalVisible(false);
    taskForm.resetFields();
    message.success('Task created successfully');
  };

  const handleMarkAsRead = (id: string, type: 'message' | 'notification') => {
    if (type === 'message') {
      setMessages(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'read' } : item
      ));
    } else {
      setNotifications(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'read' } : item
      ));
    }
  };

  const handleDelete = (id: string, type: 'message' | 'notification' | 'announcement' | 'document' | 'task') => {
    Modal.confirm({
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: `Are you sure you want to delete this ${type}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        switch (type) {
          case 'message':
            setMessages(prev => prev.filter(item => item.id !== id));
            break;
          case 'notification':
            setNotifications(prev => prev.filter(item => item.id !== id));
            break;
          case 'announcement':
            setAnnouncements(prev => prev.filter(item => item.id !== id));
            break;
          case 'document':
            setDocuments(prev => prev.filter(item => item.id !== id));
            break;
          case 'task':
            setTasks(prev => prev.filter(item => item.id !== id));
            break;
        }
        message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      }
    });
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText style={{ color: '#e74c3c' }} />;
      case 'docx':
        return <FileText style={{ color: '#2b579a' }} />;
      case 'xlsx':
        return <FileText style={{ color: '#217346' }} />;
      default:
        return <FileText />;
    }
  };

  const renderMessages = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton 
          type="primary" 
          icon={<Send size={16} />}
          onClick={() => setIsMessageModalVisible(true)}
        >
          New Message
        </ActionButton>
      </div>
      
      <List
        dataSource={messages}
        renderItem={item => (
          <MessageItem onClick={() => handleMarkAsRead(item.id, 'message')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <StatusIndicator status={item.status} />
                  <Text strong>{getUserName(item.senderId)}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    to {item.recipientIds.map(id => getUserName(id)).join(', ')}
                  </Text>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>{item.content}</Paragraph>
                {item.attachments && item.attachments.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {item.attachments.map(attachment => (
                      <div key={attachment.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <Paperclip size={14} style={{ marginRight: 4 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {attachment.name} ({attachment.size})
                        </Text>
                        <Button type="link" size="small" icon={<Download size={14} />} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(item.timestamp)}</Text>
                  <Space>
                    <PriorityTag priority={item.priority}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </PriorityTag>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, 'message');
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
          </MessageItem>
        )}
      />
    </div>
  );

  const renderNotifications = () => (
    <div>
      <List
        dataSource={notifications}
        renderItem={item => (
          <MessageItem onClick={() => handleMarkAsRead(item.id, 'notification')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <StatusIndicator status={item.status} />
                  <Text strong>{item.title}</Text>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>{item.content}</Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(item.timestamp)}</Text>
                  <Space>
                    <PriorityTag priority={item.priority}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </PriorityTag>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, 'notification');
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
          </MessageItem>
        )}
      />
    </div>
  );

  const renderAnnouncements = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton 
          type="primary" 
          icon={<Megaphone size={16} />}
          onClick={() => setIsAnnouncementModalVisible(true)}
        >
          New Announcement
        </ActionButton>
      </div>
      
      <List
        dataSource={announcements}
        renderItem={item => (
          <MessageItem>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>{item.title}</Text>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>{item.content}</Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    By {getUserName(item.authorId)} • {formatDate(item.timestamp)}
                  </Text>
                  <Space>
                    <PriorityTag priority={item.priority}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </PriorityTag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      For: {item.targetRoles.map(role => role.toUpperCase()).join(', ')}
                    </Text>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(item.id, 'announcement')}
                    />
                  </Space>
                </div>
              </div>
            </div>
          </MessageItem>
        )}
      />
    </div>
  );

  const renderDocuments = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Upload 
          action="/api/upload"
          showUploadList={false}
          onChange={info => {
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
              // In a real app, you would add the document to the state
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
        >
          <ActionButton icon={<UploadIcon size={16} />}>
            Upload Document
          </ActionButton>
        </Upload>
      </div>
      
      <List
        dataSource={documents}
        renderItem={item => (
          <MessageItem>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ marginRight: 12 }}>
                  {getFileIcon(item.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <Text strong>{item.name}</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.size} • Uploaded by {getUserName(item.uploaderId)} • {formatDate(item.timestamp)}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Shared with: {item.sharedWith.map(id => getUserName(id)).join(', ')}
                    </Text>
                  </div>
                </div>
              </div>
              <Space>
                <Button type="text" icon={<DownloadOutlined />} />
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDelete(item.id, 'document')}
                />
              </Space>
            </div>
          </MessageItem>
        )}
      />
    </div>
  );

  const renderTasks = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton 
          type="primary" 
          icon={<ClipboardList size={16} />}
          onClick={() => setIsTaskModalVisible(true)}
        >
          New Task
        </ActionButton>
      </div>
      
      <List
        dataSource={tasks}
        renderItem={item => (
          <MessageItem>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>{item.title}</Text>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>{item.description}</Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Assigned to {getUserName(item.assigneeId)} • Due: {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                  <Space>
                    <Tag color={
                      item.status === 'completed' ? 'green' : 
                      item.status === 'in-progress' ? 'blue' : 'default'
                    }>
                      {item.status.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Tag>
                    <PriorityTag priority={item.priority}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </PriorityTag>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(item.id, 'task')}
                    />
                  </Space>
                </div>
              </div>
            </div>
          </MessageItem>
        )}
      />
    </div>
  );

  return (
    <Container>
      <HeaderComponent
        title="Communication Hub"
        subtitle="Manage messages, notifications, and announcements"
        extraButtons={[
          <NotificationBadge key="notifications" count={unreadCount} size="small">
            <Button icon={<BellOutlined />} shape="circle" />
          </NotificationBadge>
        ]}
      />
      
      <SectionCard>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            key="messages"
            tab={
              <span>
                <MessageSquare size={16} style={{ marginRight: 8 }} />
                Messages {messages.filter(m => m.status === 'unread').length > 0 && 
                  `(${messages.filter(m => m.status === 'unread').length})`}
              </span>
            }
          >
            {renderMessages()}
          </TabPane>
          <TabPane
            key="notifications"
            tab={
              <span>
                <Bell size={16} style={{ marginRight: 8 }} />
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </span>
            }
          >
            {renderNotifications()}
          </TabPane>
          <TabPane
            key="announcements"
            tab={
              <span>
                <Megaphone size={16} style={{ marginRight: 8 }} />
                Announcements
              </span>
            }
          >
            {renderAnnouncements()}
          </TabPane>
          <TabPane
            key="documents"
            tab={
              <span>
                <FileText size={16} style={{ marginRight: 8 }} />
                Documents
              </span>
            }
          >
            {renderDocuments()}
          </TabPane>
          <TabPane
            key="tasks"
            tab={
              <span>
                <ClipboardList size={16} style={{ marginRight: 8 }} />
                Tasks
              </span>
            }
          >
            {renderTasks()}
          </TabPane>
        </Tabs>
      </SectionCard>
      
      <MessageModal
        visible={isMessageModalVisible}
        onCancel={() => setIsMessageModalVisible(false)}
        onSubmit={handleSendMessage}
        form={messageForm}
        mockUsers={mockUsers}
        currentUser={currentUser}
      />
      
      <AnnouncementModal
        visible={isAnnouncementModalVisible}
        onCancel={() => setIsAnnouncementModalVisible(false)}
        onSubmit={handleCreateAnnouncement}
        form={announcementForm}
      />
      
      <TaskModal
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        onSubmit={handleCreateTask}
        form={taskForm}
        mockUsers={mockUsers}
        currentUser={currentUser}
      />
    </Container>
  );
};

export default CommunicationAndNotification;
