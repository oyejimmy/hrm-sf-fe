export interface Document {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: string;
  category: string;
  description?: string;
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  version: number;
  uploadDate: string;
  uploadedBy: string;
  changes: string;
}

export interface DocumentFormValues {
  employeeName: string;
  documentType: string;
  fileName: string;
  category: string;
  description?: string;
  employeeId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export type DocumentType = 'Resume' | 'Contract' | 'ID' | 'Certificate' | 'Other';