import React, { useState, useMemo } from "react";
import { Card, Button, Typography, message, Spin, Alert, Select } from "antd";
import { Download } from "lucide-react";
import { Wrapper } from "../../../components/Wrapper";
import HeaderComponent from "../../../components/PageHeader";
import { useTheme } from "../../../contexts/ThemeContext";
import { StyledCard } from "./components/styles";
import PayslipStats from "./components/PayslipStats";
import PayslipFilters from "./components/PayslipFilters";
import PayslipTable from "./components/PayslipTable";
import PayslipDetailsModal from "./components/PayslipDetailsModal";
import { useMyPayslips, useDownloadPayslipPDF, usePayslipDetails } from "../../../hooks/api/usePayroll";
import { Payslip } from "../../../services/api/types";

interface PayslipFilters {
  searchText: string;
  searchYear: string;
}

// Custom Hook for filtering
const usePayslipFilters = (payslipData: Payslip[]) => {
  const [filteredData, setFilteredData] = useState<Payslip[]>(payslipData);
  const [filters, setFilters] = useState({
    searchText: "",
    searchYear: "2024",
    status: "",
  });

  const filterData = (searchText: string, year: string, status: string) => {
    const filtered = payslipData.filter((item: Payslip) => {
      const payPeriod = `${item.pay_period_start} - ${item.pay_period_end}`;
      const matchesText = payPeriod.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.payslip_number.toLowerCase().includes(searchText.toLowerCase());
      const matchesYear = item.pay_period_start.includes(year);
      const matchesStatus = !status || item.status === status;
      return matchesText && matchesYear && matchesStatus;
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, searchText: value }));
    filterData(value, filters.searchYear, filters.status);
  };

  const handleYearFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, searchYear: value }));
    filterData(filters.searchText, value, filters.status);
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
    filterData(filters.searchText, filters.searchYear, value);
  };

  React.useEffect(() => {
    filterData(filters.searchText, filters.searchYear, filters.status);
  }, [payslipData]);

  return {
    filteredData,
    filters,
    handleSearch,
    handleYearFilter,
    handleStatusFilter,
  };
};

// Main Component
const EmployeePayslip: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Use TanStack Query to fetch payslips
  const { data: payslipData, isLoading, error } = useMyPayslips(selectedYear);
  const { data: selectedPayslip, isLoading: isLoadingDetails } = usePayslipDetails(selectedPayslipId || 0);
  const downloadPDF = useDownloadPayslipPDF();

  // Use our custom hook for filtering
  const { filteredData, filters, handleSearch, handleYearFilter, handleStatusFilter } = usePayslipFilters(
    payslipData || []
  );

  // Calculate stats
  const stats = useMemo(() => {
    if (!payslipData?.length) return { totalPayslips: 0, totalEarnings: 0, totalDeductions: 0, avgNetPay: 0 };
    
    const totalPayslips = payslipData.length;
    const totalEarnings = payslipData.reduce((sum, p) => sum + p.total_earnings, 0);
    const totalDeductions = payslipData.reduce((sum, p) => sum + p.total_deductions, 0);
    const avgNetPay = payslipData.reduce((sum, p) => sum + p.net_salary, 0) / totalPayslips;
    
    return { totalPayslips, totalEarnings, totalDeductions, avgNetPay };
  }, [payslipData]);

  const showModal = (record: Payslip) => {
    setSelectedPayslipId(record.id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPayslipId(null);
  };

  const handleDownload = (record: Payslip) => {
    downloadPDF.mutate(record.id);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    handleYearFilter(year.toString());
  };

  if (error) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <Alert
          message="Error"
          description="Failed to load payslips. Please try again later."
          type="error"
          showIcon
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Payslip Management"
        subtitle="View and download your payslips"
        breadcrumbItems={[
          {
            title: "Dashboard",
            href: "/employee/dashboard",
          },
          {
            title: "Payslip",
          },
        ]}
      />
      
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <PayslipStats stats={stats} />

          <StyledCard title="Payslip History">

            
            <PayslipFilters
              searchText={filters.searchText}
              searchYear={filters.searchYear}
              onSearch={handleSearch}
              onYearFilter={handleYearFilter}
              onStatusFilter={handleStatusFilter}
            />

            <PayslipTable
              data={filteredData}
              onView={showModal}
              onDownload={handleDownload}
              loading={isLoading}
            />
          </StyledCard>

          <PayslipDetailsModal
            visible={isModalVisible}
            onCancel={handleCancel}
            payslip={selectedPayslip}
            loading={isLoadingDetails}
          />
        </>
      )}
    </Wrapper>
  );
};

export default EmployeePayslip;
