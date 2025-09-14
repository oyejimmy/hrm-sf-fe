export interface User {
  id: string;
  name: string;
  role: 'admin' | 'hr' | 'employee';
  avatar?: string;
  email: string;
  department: string;
}

export interface Complaint {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  comments: Comment[];
  attachments?: Attachment[];
  trackingId: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  isHR: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface ComplaintFormValues {
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  attachments?: any[];
}

export interface CommentFormValues {
  comment: string;
}