import React, { useState } from "react";
import { Tabs } from 'antd';
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import LeaveApprovalDashboard from "./components/LeaveApprovalDashboard";
import LeaveTypeManagement from "./components/LeaveTypeManagement";
import { useLeaveTypes, useCreateLeaveType, useUpdateLeaveType, useDeleteLeaveType } from '../../../hooks/api/useLeaveTypes';

const AdminLeaveManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('approvals');
  
  // Leave type management hooks
  const { data: leaveTypes = [], isLoading: leaveTypesLoading } = useLeaveTypes();
  const createLeaveTypeMutation = useCreateLeaveType();
  const updateLeaveTypeMutation = useUpdateLeaveType();
  const deleteLeaveTypeMutation = useDeleteLeaveType();
  
  const handleCreateLeaveType = (data: any) => {
    createLeaveTypeMutation.mutate(data);
  };
  
  const handleUpdateLeaveType = (id: number, data: any) => {
    updateLeaveTypeMutation.mutate({ id, data });
  };
  
  const handleDeleteLeaveType = (id: number) => {
    deleteLeaveTypeMutation.mutate(id);
  };
  
  const tabItems = [
    {
      key: 'approvals',
      label: 'Leave Approvals',
      children: <LeaveApprovalDashboard />
    },
    {
      key: 'leave-types',
      label: 'Leave Types',
      children: (
        <LeaveTypeManagement
          leaveTypes={leaveTypes}
          loading={leaveTypesLoading}
          onCreateLeaveType={handleCreateLeaveType}
          onUpdateLeaveType={handleUpdateLeaveType}
          onDeleteLeaveType={handleDeleteLeaveType}
          createLoading={createLeaveTypeMutation.isPending}
          updateLoading={updateLeaveTypeMutation.isPending}
          deleteLoading={deleteLeaveTypeMutation.isPending}
        />
      )
    }
  ];

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Leave Management Administration"
        subtitle="Comprehensive leave approval and management system"
        breadcrumbItems={[
          { title: 'Home', href: '/' },
          { title: 'Admin', href: '/admin' }
        ]}
      />
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginTop: 16 }}
      />
    </Wrapper>
  );
};

export default AdminLeaveManagementPage;