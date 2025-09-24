// components/EmployeePayslip/index.tsx
import React, { useState } from "react";
import { Card, Button, Typography, message, Spin, Alert } from "antd";
import { Download } from "lucide-react";
import { Wrapper } from "../../../components/Wrapper";
import HeaderComponent from "../../../components/PageHeader";
import { useTheme } from "../../../contexts/ThemeContext";
import { StyledCard, PageWrapper } from "./components/styles";
import PayslipStats from "./components/PayslipStats";
import PayslipFilters from "./components/PayslipFilters";
import PayslipTable from "./components/PayslipTable";
import PayslipDetailsModal from "./components/PayslipDetailsModal";
import { useMyPayslips } from "../../../hooks/api/usePayroll";
import { Payslip } from "../../../services/api/types";

interface PayslipFilters {
  searchText: string;
  searchYear: string;
}

interface Earnings {
  type: string;
  amount: number;
}

interface Deductions {
  type: string;
  amount: number;
}

const earningsData: Earnings[] = [
  { type: "Basic Salary", amount: 5000.0 },
  { type: "Overtime Pay", amount: 750.0 },
  { type: "Bonus", amount: 750.0 },
  { type: "Allowances", amount: 300.0 },
];

const deductionsData: Deductions[] = [
  { type: "Federal Tax", amount: 850.0 },
  { type: "State Tax", amount: 250.0 },
  { type: "Social Security", amount: 150.0 },
  { type: "Health Insurance", amount: 180.0 },
  { type: "Retirement Plan", amount: 200.0 },
];

// Custom Hook for filtering
const usePayslipFilters = (payslipData: Payslip[]) => {
  const [filteredData, setFilteredData] = useState<Payslip[]>(payslipData);
  const [filters, setFilters] = useState<PayslipFilters>({
    searchText: "",
    searchYear: "2024",
  });

  const filterData = (searchText: string, year: string) => {
    const filtered = payslipData.filter((item: Payslip) => {
      const matchesText = item.pay_period
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesYear = item.pay_period.includes(year);
      return matchesText && matchesYear;
    });
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, searchText: value }));
    filterData(value, filters.searchYear);
  };

  const handleYearFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, searchYear: value }));
    filterData(filters.searchText, value);
  };

  React.useEffect(() => {
    filterData(filters.searchText, filters.searchYear);
  }, [payslipData]);

  return {
    filteredData,
    filters,
    handleSearch,
    handleYearFilter,
  };
};

// Main Component
const EmployeePayslip: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Use TanStack Query to fetch payslips
  const { data: payslipData, isLoading, error } = useMyPayslips(selectedYear);

  // Use our custom hook for filtering
  const { filteredData, filters, handleSearch, handleYearFilter } = usePayslipFilters(
    payslipData || []
  );

  const showModal = (record: Payslip) => {
    setSelectedPayslip(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPayslip(null);
  };

  const handleDownload = (record: Payslip) => {
    message.success(`Downloading payslip for ${record.payPeriod}`);
    // Here you would typically download the PDF
  };

  if (error) {
    return (
      <Wrapper isDarkMode={isDarkMode}>
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
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Payslip Management"
        subtitle="Manage your all Documents"
        breadcrumbItems={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Payslip",
          },
        ]}
      />
      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <PayslipStats />

          <StyledCard title="Payslip History">
            <PayslipFilters
              searchText={filters.searchText}
              searchYear={filters.searchYear}
              onSearch={handleSearch}
              onYearFilter={handleYearFilter}
            />

            <PayslipTable
              data={filteredData.map(payslip => ({
                key: payslip.id.toString(),
                payPeriod: payslip.pay_period,
                issueDate: payslip.generated_at,
                grossPay: payslip.gross_pay,
                netPay: payslip.net_pay,
                status: payslip.status,
                deductions: payslip.total_deductions,
              }))}
              onView={(record) => {
                const originalPayslip = payslipData?.find(p => p.id.toString() === record.key);
                if (originalPayslip) showModal(originalPayslip as any);
              }}
              onDownload={handleDownload}
              loading={isLoading}
            />
          </StyledCard>

          <PayslipDetailsModal
            visible={isModalVisible}
            onCancel={handleCancel}
            payslip={selectedPayslip}
            earnings={earningsData}
            deductions={deductionsData}
          />
        </>
      )}
    </Wrapper>
  );
};

export default EmployeePayslip;
