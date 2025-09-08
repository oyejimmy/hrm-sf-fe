export interface Asset {
  id: string;
  name: string;
  category: string;
  status: "Assigned" | "Returned" | "Overdue" | "Damaged";
  assignedDate: string;
  returnDate?: string;
  image?: string;
  serialNumber?: string;
  condition?: "New" | "Good" | "Needs Repair" | "Damaged";
}

export interface AssetRequest {
  id: string;
  employeeId: string;
  category: string;
  justification: string;
  urgency?: "Low" | "Medium" | "High";
  duration?: string;
  status: "Pending" | "Approved" | "Rejected";
}
