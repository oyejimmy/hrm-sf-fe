export interface Document {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: "verified" | "pending" | "expired";
  uploadDate: string;
  fileUrl: string;
}
