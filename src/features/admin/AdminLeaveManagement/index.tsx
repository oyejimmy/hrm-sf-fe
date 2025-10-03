import React from "react";
import HeaderComponent from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import LeaveApprovalDashboard from "./components/LeaveApprovalDashboard";

const AdminLeaveManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

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
      
      <LeaveApprovalDashboard />
    </Wrapper>
  );
};

export default AdminLeaveManagementPage;