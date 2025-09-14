export interface User {
  id: string;
  name: string;
  role: 'admin' | 'hr';
  avatar?: string;
  email: string;
  department: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientIds: string[];
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  priority: 'low' | 'medium' | 'high';
  attachments?: Attachment[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  type: 'system' | 'alert' | 'reminder';
  priority: 'low' | 'medium' | 'high';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: ('admin' | 'hr')[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaderId: string;
  timestamp: string;
  sharedWith: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignerId: string;
  assigneeId: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface MessageFormValues {
  recipients: string[];
  content: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: any[];
}

export interface AnnouncementFormValues {
  title: string;
  content: string;
  targetRoles: ('admin' | 'hr')[];
  priority: 'low' | 'medium' | 'high';
}

export interface TaskFormValues {
  title: string;
  description: string;
  assignee: string;
  dueDate: any;
  priority: 'low' | 'medium' | 'high';
}