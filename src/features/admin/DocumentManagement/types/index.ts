export interface EmployeeDocument {
  id?: number;
  employeeName: string;
  documentType: string;
  fileName: string;
  fileUrl: string; // uploaded file path or URL
  uploadDate: string;
}
