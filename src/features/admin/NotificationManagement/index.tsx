import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  message,
  Typography,
  Tooltip,
  Badge,
  DatePicker,
  Card
} from 'antd';
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Mail,
  Calendar,
  Circle,
  Settings,
  Users,
  AlertTriangle,
  SearchIcon,
  CheckCircle2Icon,
  LucideDelete,
  PlusCircle,
  Edit2Icon
} from 'lucide-react';
import HeaderComponent from '../../../components/PageHeader';
import { Container, StatsCard, FilterCard, NotificationCard } from './styles';
import { Notification, User, NotificationFormValues } from './types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Mock data and constants

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', role: 'admin', email: 'admin@company.com' },
  { id: '2', name: 'HR Manager', role: 'hr', email: 'hr@company.com' },
  { id: '3', name: 'John Doe', role: 'employee', email: 'john.doe@company.com' },
  { id: '4', name: 'Jane Smith', role: 'employee', email: 'jane.smith@company.com' },
  { id: '5', name: 'Robert Johnson', role: 'employee', email: 'robert.johnson@company.com' },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    content: 'There will be a system maintenance on Saturday from 2 AM to 4 AM. Please save your work before this time.',
    createdAt: '2023-05-15T10:30:00',
    status: 'unread',
    priority: 'medium',
    category: 'system',
    recipientType: 'all',
    createdBy: '1'
  },
  {
    id: '2',
    title: 'HR Policy Update',
    content: 'The HR policy has been updated. Please review the changes in the employee handbook.',
    createdAt: '2023-05-14T14:15:00',
    status: 'read',
    priority: 'high',
    category: 'hr',
    recipientType: 'all',
    createdBy: '2'
  },
  {
    id: '3',
    title: 'Vacation Request Approved',
    content: 'Your vacation request for June 10-15 has been approved.',
    createdAt: '2023-05-13T09:45:00',
    status: 'unread',
    priority: 'low',
    category: 'employee_request',
    recipientType: 'specific',
    recipients: ['3'],
    createdBy: '2'
  },
  {
    id: '4',
    title: 'Security Alert',
    content: 'We detected suspicious activity on the network. Please change your password immediately.',
    createdAt: '2023-05-12T16:20:00',
    status: 'read',
    priority: 'critical',
    category: 'system',
    recipientType: 'all',
    createdBy: '1'
  },
  {
    id: '5',
    title: 'Training Session Reminder',
    content: 'Reminder: The mandatory training session is scheduled for tomorrow at 10 AM in Conference Room B.',
    createdAt: '2023-05-11T11:30:00',
    status: 'read',
    priority: 'medium',
    category: 'general',
    recipientType: 'role_based',
    recipients: ['employee'],
    createdBy: '2'
  },
];

// Priority colors and icons
const priorityColors: Record<string, string> = {
  low: 'blue',
  medium: 'green',
  high: 'orange',
  critical: 'red'
};

const priorityIcons: Record<string, React.ReactNode> = {
  low: <Circle size={14} />,
  medium: <Clock size={14} />,
  high: <AlertCircle size={14} />,
  critical: <AlertTriangle size={14} />
};

// Status colors and icons
const statusColors: Record<string, string> = {
  read: 'default',
  unread: 'blue'
};

const statusIcons: Record<string, React.ReactNode> = {
  read: <CheckCircle size={14} />,
  unread: <Bell size={14} />
};

// Category colors and icons
const categoryColors: Record<string, string> = {
  system: 'purple',
  hr: 'cyan',
  employee_request: 'green',
  general: 'gold'
};

const categoryIcons: Record<string, React.ReactNode> = {
  system: <Settings size={14} />,
  hr: <Users size={14} />,
  employee_request: <Mail size={14} />,
  general: <Bell size={14} />
};

// Main Component
const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });
  const [form] = Form.useForm();
  const currentUser: User = mockUsers[0]; // Assuming current user is admin

  // Apply filters
  useEffect(() => {
    let result = notifications;

    if (filters.status) {
      result = result.filter(notification => notification.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(notification => notification.priority === filters.priority);
    }

    if (filters.category) {
      result = result.filter(notification => notification.category === filters.category);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(notification =>
        notification.title.toLowerCase().includes(query) ||
        notification.content.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(result);
  }, [filters, notifications]);

  const handleAddNotification = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const handleEditNotification = (notification: Notification) => {
    // Check if user has permission to edit
    if (!hasEditPermission(notification)) {
      message.error('You do not have permission to edit this notification');
      return;
    }

    setSelectedNotification(notification);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      ...notification,
      createdAt: dayjs(notification.createdAt)
    });
  };

  const handleDeleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);

    // Check if user has permission to delete
    if (notification && !hasDeletePermission(notification)) {
      message.error('You do not have permission to delete this notification');
      return;
    }

    Modal.confirm({
      title: 'Delete Notification',
      content: 'Are you sure you want to delete this notification? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        message.success('Notification deleted successfully');
      }
    });
  };

  const handlePreviewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsPreviewModalVisible(true);

    // Mark as read when previewing
    if (notification.status === 'unread') {
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, status: 'read' } : n
      ));
    }
  };

  const handleFormSubmit = (values: NotificationFormValues) => {
    const notificationData = {
      ...values,
      createdAt: values.createdAt ? values.createdAt.format() : new Date().toISOString(),
      status: 'unread',
      createdBy: currentUser.id
    };

    if (selectedNotification) {
      // Update existing notification
      setNotifications((prev: any) => prev.map((notification: any) =>
        notification.id === selectedNotification.id ?
          { ...notification, ...notificationData, updatedAt: new Date().toISOString() } : notification
      ));
      message.success('Notification updated successfully');
      setIsEditModalVisible(false);
    } else {
      // Add new notification
      const newNotification: any = {
        ...notificationData,
        id: Date.now().toString(),
      };
      setNotifications(prev => [...prev, newNotification]);
      message.success('Notification added successfully');
      setIsAddModalVisible(false);
    }

    form.resetFields();
    setSelectedNotification(null);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one notification to delete');
      return;
    }

    // Check if user has permission to delete all selected notifications
    const hasPermission = selectedRowKeys.every(key => {
      const notification = notifications.find(n => n.id === key);
      return notification ? hasDeletePermission(notification) : true;
    });

    if (!hasPermission) {
      message.error('You do not have permission to delete some of the selected notifications');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Notifications',
      content: `Are you sure you want to delete ${selectedRowKeys.length} notifications? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setNotifications(prev => prev.filter(notification => !selectedRowKeys.includes(notification.id)));
        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} notifications deleted successfully`);
      }
    });
  };

  const handleBulkMarkAsRead = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one notification');
      return;
    }

    setNotifications(prev => prev.map(notification =>
      selectedRowKeys.includes(notification.id) ? { ...notification, status: 'read' } : notification
    ));
    setSelectedRowKeys([]);
    message.success(`${selectedRowKeys.length} notifications marked as read`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasEditPermission = (notification: Notification): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'hr') {
      return notification.category === 'employee_request' || notification.category === 'hr';
    }
    return false;
  };

  const hasDeletePermission = (notification: Notification): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'hr') {
      return notification.category === 'employee_request' || notification.category === 'hr';
    }
    return false;
  };

  const canCreateNotification = (): boolean => {
    return currentUser.role === 'admin' || currentUser.role === 'hr';
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tooltip title={status.charAt(0).toUpperCase() + status.slice(1)}>
          <Badge
            status={status === 'unread' ? 'processing' : 'default'}
            text={status === 'unread' ? 'Unread' : 'Read'}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Notification) => (
        <Space direction="vertical" size={0}>
          <Text strong>{title}</Text>
          <Text type="secondary" ellipsis={{ tooltip: record.content }} style={{ maxWidth: 200 }}>
            {record.content}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priorityColors[priority]} icon={priorityIcons[priority]}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={categoryColors[category]} icon={categoryIcons[category]}>
          {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Space>
          <Calendar size={14} />
          {new Date(date).toLocaleDateString()}
          <Clock size={14} />
          {new Date(date).toLocaleTimeString()}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Notification) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button
              icon={<Eye size={16} />}
              size="small"
              onClick={() => handlePreviewNotification(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<Edit3 size={16} />}
              size="small"
              onClick={() => handleEditNotification(record)}
              disabled={!hasEditPermission(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<Trash2 size={16} />}
              size="small"
              danger
              onClick={() => handleDeleteNotification(record.id)}
              disabled={!hasDeletePermission(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <HeaderComponent
        title="Notification Management"
        subtitle="Manage system notifications and announcements"
        extraButtons={[
          canCreateNotification() && (
            <Button
              key="add-notification"
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleAddNotification}
            >
              Add Notification
            </Button>
          )
        ].filter(Boolean)}
      />

      {/* Stats Card */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Space>
              <Bell size={24} />
              <div>
                <Text type="secondary">Total Notifications</Text>
                <Title level={3} style={{ margin: 0 }}>{notifications.length}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space>
              <Clock size={24} />
              <div>
                <Text type="secondary">Unread</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {notifications.filter(n => n.status === 'unread').length}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space>
              <AlertCircle size={24} />
              <div>
                <Text type="secondary">High Priority</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space>
              <Mail size={24} />
              <div>
                <Text type="secondary">Employee Requests</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {notifications.filter(n => n.category === 'employee_request').length}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Search notifications..."
              prefix={<SearchIcon />}
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              allowClear
              value={filters.status || undefined}
              onChange={value => handleFilterChange('status', value)}
            >
              <Option value="read">Read</Option>
              <Option value="unread">Unread</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Priority"
              style={{ width: '100%' }}
              allowClear
              value={filters.priority || undefined}
              onChange={value => handleFilterChange('priority', value)}
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Category"
              style={{ width: '100%' }}
              allowClear
              value={filters.category || undefined}
              onChange={value => handleFilterChange('category', value)}
            >
              <Option value="system">System</Option>
              <Option value="hr">HR</Option>
              <Option value="employee_request">Employee Request</Option>
              <Option value="general">General</Option>
            </Select>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button
                    icon={<CheckCircle2Icon />}
                    onClick={handleBulkMarkAsRead}
                  >
                    Mark as Read ({selectedRowKeys.length})
                  </Button>
                  <Button
                    icon={<LucideDelete />}
                    danger
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedRowKeys.length})
                  </Button>
                </>
              )}
              {canCreateNotification() && (
                <Button
                  type="primary"
                  icon={<PlusCircle />}
                  onClick={handleAddNotification}
                >
                  Add Notification
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Notifications Table */}
      <Card
        title="Notifications"
        extra={
          <Text>
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </Text>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredNotifications}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Add/Edit Notification Modal */}
      <Modal
        title={selectedNotification ? 'Edit Notification' : 'Add New Notification'}
        visible={isAddModalVisible || isEditModalVisible}
        width={600}
        onCancel={() => {
          setIsAddModalVisible(false);
          setIsEditModalVisible(false);
          setSelectedNotification(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter notification title" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <TextArea rows={4} placeholder="Enter notification content" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="system">System</Option>
                  <Option value="hr">HR</Option>
                  <Option value="employee_request">Employee Request</Option>
                  <Option value="general">General</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="recipientType"
            label="Recipient Type"
            rules={[{ required: true, message: 'Please select recipient type' }]}
          >
            <Select placeholder="Select recipient type">
              <Option value="all">All Users</Option>
              <Option value="role_based">Role Based</Option>
              <Option value="specific">Specific Users</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Created Date"
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                setIsAddModalVisible(false);
                setIsEditModalVisible(false);
                setSelectedNotification(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedNotification ? 'Update Notification' : 'Add Notification'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notification Preview Modal */}
      <Modal
        title="Notification Details"
        visible={isPreviewModalVisible}
        width={600}
        onCancel={() => setIsPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<Edit2Icon />}
            onClick={() => {
              setIsPreviewModalVisible(false);
              setIsEditModalVisible(true);
            }}
            disabled={selectedNotification ? !hasEditPermission(selectedNotification) : true}
          >
            Edit
          </Button>
        ]}
      >
        {selectedNotification && (
          <div>
            <Title level={4}>{selectedNotification.title}</Title>
            <Paragraph>{selectedNotification.content}</Paragraph>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Priority:</Text>
                <br />
                <Tag color={priorityColors[selectedNotification.priority]}>
                  {selectedNotification.priority.charAt(0).toUpperCase() + selectedNotification.priority.slice(1)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Category:</Text>
                <br />
                <Tag color={categoryColors[selectedNotification.category]}>
                  {selectedNotification.category.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Tag>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text strong>Status:</Text>
                <br />
                <Tag color={statusColors[selectedNotification.status]}>
                  {selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Created:</Text>
                <br />
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Text strong>Recipient Type:</Text>
                <br />
                {selectedNotification.recipientType.split('_').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default NotificationManagement;