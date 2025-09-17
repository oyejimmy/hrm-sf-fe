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
  Upload,
  Input,
  DatePicker,
  Select,
  Avatar,
  Flex
} from 'antd';
import {
  BellOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EditOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  CheckSquareOutlined
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
import { useTheme } from '../../../contexts/ThemeContext';

const { Text, Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

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
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'message' | 'notification' | 'announcement'>('message');
  const [editingItem, setEditingItem] = useState<Message | Notification | Announcement | null>(null);
  const [form] = Form.useForm();

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleOpenModal = (type: 'message' | 'notification' | 'announcement', item?: Message | Notification | Announcement) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDelete = (id: string, type: 'message' | 'notification' | 'announcement') => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${type}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        if (type === 'message') {
          setMessages(messages.filter(msg => msg.id !== id));
        } else if (type === 'notification') {
          setNotifications(notifications.filter(notif => notif.id !== id));
        } else if (type === 'announcement') {
          setAnnouncements(announcements.filter(ann => ann.id !== id));
        }
        message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      },
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, status: 'read' } : notif
    ));
    message.success('Notification marked as read.');
  };

  const handleFormSubmit = (values: any) => {
    const newItem = { ...values, id: editingItem?.id || Date.now().toString(), timestamp: editingItem?.timestamp || new Date().toISOString() };
    if (modalType === 'message') {
      if (editingItem) {
        setMessages(messages.map(msg => msg.id === newItem.id ? newItem : msg));
      } else {
        setMessages([...messages, { ...newItem, status: 'unread' }]);
      }
    } else if (modalType === 'notification') {
      if (editingItem) {
        setNotifications(notifications.map(notif => notif.id === newItem.id ? newItem : notif));
      } else {
        setNotifications([...notifications, { ...newItem, status: 'unread' }]);
      }
    } else if (modalType === 'announcement') {
      if (editingItem) {
        setAnnouncements(announcements.map(ann => ann.id === newItem.id ? newItem : ann));
      } else {
        setAnnouncements([...announcements, newItem]);
      }
    }
    message.success(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${editingItem ? 'updated' : 'created'} successfully.`);
    handleCloseModal();
  };

  const renderMessageList = (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Messages</Title>
        <Button type="primary" onClick={() => handleOpenModal('message')}>New Message</Button>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => (
          <div style={{ padding: '12px', border: '1px solid #f0f0f0', marginBottom: '8px', borderRadius: '6px' }}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={<a onClick={() => handleOpenModal('message', item)}>{item.content.substring(0, 50)}...</a>}
              description={
                <Space direction="vertical" size={4}>
                  <Text type="secondary">From: {mockUsers.find(u => u.id === item.senderId)?.name}</Text>
                  <Text type="secondary">To: {item.recipientIds.map(id => mockUsers.find(u => u.id === id)?.name).join(', ')}</Text>
                  <Text>{item.content}</Text>
                  <Text type="secondary" style={{ fontSize: '0.8em' }}>{new Date(item.timestamp).toLocaleString()}</Text>
                </Space>
              }
            />
            <div>
              <Space>
                <Tag color={item.status === 'read' ? 'default' : 'blue'}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Tag>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => handleOpenModal('message', item)}
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDelete(item.id, 'message')}
                />
              </Space>
            </div>
          </div>
        )}
      />
    </div>
  );

  const renderNotificationList = (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Notifications</Title>
        <Button type="primary" onClick={() => handleOpenModal('notification')}>New Notification</Button>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <div style={{ padding: '12px', border: '1px solid #f0f0f0', marginBottom: '8px', borderRadius: '6px', backgroundColor: item.status === 'unread' ? '#f6ffed' : 'white' }}>
            <List.Item.Meta
              avatar={<Avatar icon={<InfoCircleOutlined />} />}
              title={<a onClick={() => handleOpenModal('notification', item)}>{item.title}</a>}
              description={
                <Space direction="vertical" size={4}>
                  <Text>{item.content}</Text>
                  <Text type="secondary" style={{ fontSize: '0.8em' }}>{new Date(item.timestamp).toLocaleString()}</Text>
                </Space>
              }
            />
            <div>
              <Space>
                <Tag color={item.status === 'read' ? 'default' : 'red'}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Tag>
                {item.status === 'unread' && (
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<CheckCircleOutlined />} 
                    onClick={() => handleMarkAsRead(item.id)}
                  />
                )}
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => handleOpenModal('notification', item)}
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDelete(item.id, 'notification')}
                />
              </Space>
            </div>
          </div>
        )}
      />
    </div>
  );

  const renderAnnouncementList = (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Announcements</Title>
        <Button type="primary" onClick={() => handleOpenModal('announcement')}>New Announcement</Button>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={announcements}
        renderItem={item => (
          <div style={{ padding: '12px', border: '1px solid #f0f0f0', marginBottom: '8px', borderRadius: '6px' }}>
            <List.Item.Meta
              avatar={<Avatar icon={<SoundOutlined />} />}
              title={<a onClick={() => handleOpenModal('announcement', item)}>{item.title}</a>}
              description={
                <Space direction="vertical" size={4}>
                  <Text>{item.content}</Text>
                  <Text type="secondary" style={{ fontSize: '0.8em' }}>{new Date(item.timestamp).toLocaleString()}</Text>
                </Space>
              }
            />
            <div>
              <Space>
                <Tag color="green">Active</Tag>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => handleOpenModal('announcement', item)}
                />
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDelete(item.id, 'announcement')}
                />
              </Space>
            </div>
          </div>
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
          <Button key="notifications" icon={<BellOutlined />} shape="circle" />
        ]}
        isDarkMode={isDarkMode}
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
            {renderMessageList}
          </TabPane>
          <TabPane
            key="notifications"
            tab={
              <span>
                <BellOutlined style={{ marginRight: 8 }} />
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </span>
            }
          >
            {renderNotificationList}
          </TabPane>
          <TabPane
            key="announcements"
            tab={
              <span>
                <SoundOutlined style={{ marginRight: 8 }} />
                Announcements
              </span>
            }
          >
            {renderAnnouncementList}
          </TabPane>
        </Tabs>
      </SectionCard>

      <Modal
        title={editingItem ? `Edit ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}` : `New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={editingItem || {}}
        >
          {modalType === 'message' && (
            <>
              <Form.Item name="senderId" label="Sender" rules={[{ required: true, message: 'Please select sender!' }]}>
                <Select placeholder="Select Sender">
                  {mockUsers.map(user => (
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="recipientIds" label="Recipients" rules={[{ required: true, message: 'Please select recipients!' }]}>
                <Select mode="multiple" placeholder="Select Recipients">
                  {mockUsers.map(user => (
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content!' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default CommunicationAndNotification;