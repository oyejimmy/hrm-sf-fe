import { Request, HRDocument, RequestLog } from '../types';

export const mockApi = {
  getRequests: async (): Promise<Request[]> => {
    return [
      {
        id: "1",
        type: "loan",
        subject: "Home Loan Request",
        status: "pending",
        date: "2023-01-01",
        details: "Need a loan for home purchase. Planning to buy a new apartment in the city center.",
        amount: 50000,
        priority: "high",
      },
      {
        id: "2",
        type: "document",
        subject: "Salary Slip Request",
        status: "approved",
        date: "2023-01-05",
        details: "Request for last 3 months salary slips for bank loan application.",
        documentType: "Salary Certificate",
        approver: "John Manager",
        priority: "medium",
      },
      {
        id: "3",
        type: "leave",
        subject: "Annual Leave Request",
        status: "rejected",
        date: "2023-01-10",
        details: "Need to take 2 weeks off for family vacation.",
        startDate: "2023-02-01",
        endDate: "2023-02-14",
        approverComments: "Project deadline during this period. Please reschedule.",
        priority: "medium",
      },
      {
        id: "4",
        type: "equipment",
        subject: "New Laptop Request",
        status: "approved",
        date: "2023-01-15",
        details: "Current laptop is outdated and affecting productivity. Need a replacement.",
        equipmentType: 'MacBook Pro 16"',
        approver: "Sarah HR",
        priority: "low",
      },
      {
        id: "5",
        type: "travel",
        subject: "Business Trip to Conference",
        status: "pending",
        date: "2023-01-20",
        details: "Request for travel approval to attend Tech Conference in San Francisco.",
        destination: "San Francisco, USA",
        priority: "high",
      },
      {
        id: "6",
        type: "recognition",
        subject: "Employee of the Month Nomination",
        status: "in_progress",
        date: "2023-01-25",
        details: "Nomination for outstanding performance and contribution to the project.",
        recognitionType: "Employee of the Month",
        priority: "medium",
      },
    ];
  },

  getDocuments: async (): Promise<HRDocument[]> => {
    return [
      {
        id: "1",
        name: "Company Policy Handbook.pdf",
        type: "PDF",
        uploadDate: "2023-02-01",
        url: "#",
        size: "2.4 MB",
      },
      {
        id: "2",
        name: "HR Procedures Manual.docx",
        type: "Word",
        uploadDate: "2023-02-15",
        url: "#",
        size: "1.8 MB",
      },
      {
        id: "3",
        name: "Employee Benefits Guide.pdf",
        type: "PDF",
        uploadDate: "2023-03-01",
        url: "#",
        size: "3.2 MB",
      },
    ];
  },

  getLogs: async (): Promise<RequestLog[]> => {
    return [
      {
        id: "1",
        timestamp: "2023-01-15 10:30:45",
        action: "CREATE",
        performedBy: "You",
        details: "Created equipment request for new laptop",
        avatar: "https://example.com/avatar1.jpg",
      },
      {
        id: "2",
        timestamp: "2023-01-16 14:22:33",
        action: "APPROVE",
        performedBy: "Sarah HR",
        details: "Approved laptop request",
        avatar: "https://example.com/avatar2.jpg",
      },
    ];
  },

  updateRequest: async (requestId: string, updates: Partial<Request>): Promise<Request> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...updates, id: requestId } as Request;
  },

  createRequest: async (request: Omit<Request, "id">): Promise<Request> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...request, id: Date.now().toString() } as Request;
  },

  createLog: async (log: Omit<RequestLog, "id">): Promise<RequestLog> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ...log, id: Date.now().toString() };
  },

  deleteRequest: async (requestId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};