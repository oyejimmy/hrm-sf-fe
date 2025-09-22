import React, { useState } from "react";
import { message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import DocumentList from "./components/DocumentList";
import ActivityLogs from "./components/ActivityLogs";
import RequestModal from "./components/RequestModal";
import MyRequestsTable from "./components/MyRequestsTable";
import { RequestStats } from "./components/RequestStats";
import { TabNavigation } from "./components/TabNavigation";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import { Request, UserRole } from "./types";
import { mockApi } from "./services/api";
import { useRequestActions } from "./hooks/useRequestActions";

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

  const { data: requests = [] } = useQuery({
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

  const { handleApprove, handleReject, handleDelete, handleRequestSubmit, isCreating } = useRequestActions(userRole, refetchLogs);

  const handleModalSubmit = (values: any) => {
    handleRequestSubmit(values);
    setIsModalVisible(false);
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

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Employee Requests"
        subtitle="Create, track, and manage your workplace requests"
        breadcrumbItems={[
          { title: "Home", href: "/" },
          { title: "Employee Requests" }
        ]}
        extraButtons={[
          <Button
            key="new-request"
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRequest(null);
              setIsModalVisible(true);
            }}
          >
            New Request
          </Button>
        ]}
      />
      <RequestStats requests={requests} isDarkMode={isDarkMode} />
      <RequestModal
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRequest(null);
        }}
        onSubmit={handleModalSubmit}
        isDarkMode={isDarkMode}
        isLoading={isCreating}
        initialValues={editingRequest}
      />

      <div style={{
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderRadius: '12px',
        border: `1px solid ${isDarkMode ? '#333' : '#e8e8e8'}`,
        boxShadow: isDarkMode 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        margin: '0 -8px'
      }}>
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isDarkMode={isDarkMode} 
        />
        
        <div style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
          {activeTab === '1' && (
            <MyRequestsTable
              requests={requests}
              isDarkMode={isDarkMode}
              userRole={userRole}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          
          {activeTab === '2' && (
            <DocumentList
              documents={hrDocuments}
              isDarkMode={isDarkMode}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
            />
          )}
          
          {activeTab === '3' && (
            <ActivityLogs logs={logs} isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 576px) {
          .tab-text {
            display: none;
          }
          .ant-tabs-tab {
            padding: 8px 12px !important;
          }
        }
        @media (min-width: 577px) {
          .tab-text {
            display: inline;
          }
        }
      `}</style>
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
