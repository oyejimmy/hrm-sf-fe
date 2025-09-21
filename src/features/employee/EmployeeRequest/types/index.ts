export type UserRole = 'employee' | 'manager' | 'hr';
export type RequestType = 'loan' | 'document' | 'leave' | 'equipment' | 'travel' | 'recognition';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export interface Request {
  id: string;
  type: RequestType;
  subject: string;
  status: RequestStatus;
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
  priority?: 'low' | 'medium' | 'high';
}

export interface HRDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
  size: string;
}

export interface RequestLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  avatar?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface CreateRequestPayload {
  type: RequestType;
  subject: string;
  details: string;
  amount?: number;
  documentType?: string;
  startDate?: string;
  endDate?: string;
  equipmentType?: string;
  destination?: string;
  recognitionType?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateRequestPayload {
  status?: RequestStatus;
  approver?: string;
  approverComments?: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}