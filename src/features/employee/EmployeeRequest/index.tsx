import React, { useState } from "react";
import { Tabs, message, Row, Col, Statistic, Modal } from "antd";
import {
  FileTextOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import DocumentList from "./components/DocumentList";
import ActivityLogs from "./components/ActivityLogs";
import RequestModal from "./components/RequestModal";
import MyRequestsTable from "./components/MyRequestsTable";
import { StyledCard, StyledTabs, PrimaryButton } from "./components/styles";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import { Request, HRDocument, RequestLog, UserRole } from "./types";
import { StateCard } from "../../../components/StateCard";
import { BadgeDollarSignIcon, DollarSignIcon } from "lucide-react";

// Mock API functions (same as before)
// Mock API functions
const mockApi = {
  getRequests: async (): Promise<Request[]> => {
    return [
      {
        id: "1",
        type: "loan",
        subject: "Home Loan Request",
        status: "pending",
        date: "2023-01-01",
        details:
          "Need a loan for home purchase. Planning to buy a new apartment in the city center.",
        amount: 50000,
        priority: "high",
      },
      {
        id: "2",
        type: "document",
        subject: "Salary Slip Request",
        status: "approved",
        date: "2023-01-05",
        details:
          "Request for last 3 months salary slips for bank loan application.",
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
        approverComments:
          "Project deadline during this period. Please reschedule.",
        priority: "medium",
      },
      {
        id: "4",
        type: "equipment",
        subject: "New Laptop Request",
        status: "approved",
        date: "2023-01-15",
        details:
          "Current laptop is outdated and affecting productivity. Need a replacement.",
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
        details:
          "Request for travel approval to attend Tech Conference in San Francisco.",
        destination: "San Francisco, USA",
        priority: "high",
      },
      {
        id: "6",
        type: "recognition",
        subject: "Employee of the Month Nomination",
        status: "in_progress",
        date: "2023-01-25",
        details:
          "Nomination for outstanding performance and contribution to the project.",
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

  updateRequest: async (
    requestId: string,
    updates: Partial<Request>
  ): Promise<Request> => {
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const EmployeeRequestContent = () => {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [userRole] = useState<UserRole>("employee");
  const [activeTab, setActiveTab] = useState<string>("1");

  // TanStack Query hooks
  const { data: requests = [], refetch: refetchRequests } = useQuery({
    queryKey: ["requests"],
    queryFn: mockApi.getRequests,
  });

  const { data: hrDocuments = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: mockApi.getDocuments,
  });

  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ["logs"],
    queryFn: mockApi.getLogs,
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({
      requestId,
      updates,
    }: {
      requestId: string;
      updates: Partial<Request>;
    }) => mockApi.updateRequest(requestId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      refetchLogs();
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: (request: Omit<Request, "id">) =>
      mockApi.createRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      refetchLogs();
      setIsModalVisible(false);
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: string) => mockApi.deleteRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      refetchLogs();
    },
  });

  const createLogMutation = useMutation({
    mutationFn: (log: Omit<RequestLog, "id">) => mockApi.createLog(log),
    onSuccess: () => {
      refetchLogs();
    },
  });

  const handleApprove = (requestId: string) => {
    updateRequestMutation.mutate({
      requestId,
      updates: { status: "approved", approver: "Manager Name" },
    });
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: "APPROVE",
      performedBy: userRole,
      details: `Approved request ${requestId}`,
    });
    message.success("Request approved successfully!");
  };

  const handleReject = (requestId: string, comments: string) => {
    updateRequestMutation.mutate({
      requestId,
      updates: { status: "rejected", approverComments: comments },
    });
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: "REJECT",
      performedBy: userRole,
      details: `Rejected request ${requestId} with comments: ${comments}`,
    });
    message.warning("Request rejected.");
  };

  const handleDelete = (requestId: string) => {
    Modal.confirm({
      title: "Delete Request",
      content:
        "Are you sure you want to delete this request? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteRequestMutation.mutate(requestId);
        createLogMutation.mutate({
          timestamp: new Date().toISOString(),
          action: "DELETE",
          performedBy: userRole,
          details: `Deleted request ${requestId}`,
        });
        message.success("Request deleted successfully!");
      },
    });
  };

  const handleRequestSubmit = async (values: any) => {
    const newRequest: Omit<Request, "id"> = {
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      ...values,
    };

    createRequestMutation.mutate(newRequest);
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: "CREATE",
      performedBy: "Employee",
      details: `Created request (${values.type})`,
    });
    message.success("Request submitted successfully!");
  };

  const handleEdit = (request: Request) => {
    setEditingRequest(request);
    setIsModalVisible(true);
  };

  const handleViewDocument = (document: any) => {
    message.info(`Viewing document: ${document.name}`);
  };

  const handleDownloadDocument = (document: any) => {
    message.success(`Downloading document: ${document.name}`);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((req) => req.status === "pending").length,
    approved: requests.filter((req) => req.status === "approved").length,
    rejected: requests.filter((req) => req.status === "rejected").length,
    in_progress: requests.filter((req) => req.status === "in_progress").length,
  };

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Employee Requests"
        subtitle="Create, track, and manage requests. HR can review and update"
        breadcrumbItems={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Employee Requests",
          },
        ]}
        extraButtons={[
          <PrimaryButton
            key="new-request"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRequest(null);
              setIsModalVisible(true);
            }}
          >
            New Request
          </PrimaryButton>,
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <StateCard
            label="Total"
            value={stats.total}
            icon={<FileTextOutlined />}
            tone="pastelBlue"
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <StateCard
            label="Approved"
            value={stats.approved}
            icon={<CheckCircleOutlined />}
            tone="pastelGreen"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <StateCard
            label="In Progress"
            value={stats.in_progress}
            icon={<ClockCircleOutlined />}
            tone="lightPeach"
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <StateCard
            label="Pending"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            tone="softLavender"
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <StateCard
            label="Rejected"
            value={stats.rejected}
            icon={<CloseCircleOutlined />}
            tone="pastelPink"
            valueStyle={{ color: "#f5222d" }}
          />
        </Col>
      </Row>
      <RequestModal
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRequest(null);
        }}
        onSubmit={handleRequestSubmit}
        isDarkMode={isDarkMode}
        isLoading={createRequestMutation.isPending}
        initialValues={editingRequest}
      />

      <StyledTabs
        activeKey={activeTab}
        type="card"
        size="large"
        onChange={setActiveTab}
        isDarkMode={isDarkMode}
      >
        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined /> My Requests
            </span>
          }
          key="1"
        >
          <StyledCard isDarkMode={isDarkMode}>
            <MyRequestsTable
              requests={requests}
              isDarkMode={isDarkMode}
              userRole={userRole}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </StyledCard>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <FileSearchOutlined /> HR Documents
            </span>
          }
          key="2"
        >
          <DocumentList
            documents={hrDocuments}
            isDarkMode={isDarkMode}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <BarChartOutlined /> Activity Logs
            </span>
          }
          key="3"
        >
          <ActivityLogs logs={logs} isDarkMode={isDarkMode} />
        </Tabs.TabPane>
      </StyledTabs>
    </Wrapper>
  );
};

const EmployeeRequest = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EmployeeRequestContent />
    </QueryClientProvider>
  );
};

export default EmployeeRequest;
