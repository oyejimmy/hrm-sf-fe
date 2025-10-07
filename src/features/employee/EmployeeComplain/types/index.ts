export interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: string;
  date: string;
  priority: string;
  description: string;
  attachments?: string[];
}