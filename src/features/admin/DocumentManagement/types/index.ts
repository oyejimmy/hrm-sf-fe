export interface Employee {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  email: string;
}

export interface Document {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  category: string;
  description?: string;
  versions: DocumentVersion[];
  requestedBy?: string;
}

export interface DocumentVersion {
  version: number;
  uploadDate: string;
  uploadedBy: string;
  changes: string;
}

export interface DocumentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  required: boolean;
}

export interface FilterOptions {
  employee: string;
  documentType: string;
  status: string;
  category: string;
  dateRange: any | null;
}

export interface DocumentFormValues {
  employeeId: string;
  documentType: string;
  category: string;
  uploadDate?: any;
  description?: string;
  file?: any;
}