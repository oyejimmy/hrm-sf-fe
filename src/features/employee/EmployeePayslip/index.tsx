// components/EmployeePayslip/index.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

// Types
interface Payslip {
  key: string;
  payPeriod: string;
  issueDate: string;
  grossPay: number;
  netPay: number;
  status: string;
  deductions: number;
}

interface Earnings {
  type: string;
  amount: number;
}

interface Deductions {
  type: string;
  amount: number;
}

interface PayslipFilters {
  searchText: string;
  searchYear: string;
}

// Mock Data
const payslipData: Payslip[] = [
  {
    key: "1",
    payPeriod: "October 2023",
    issueDate: "2023-10-31",
    grossPay: 6500.0,
    netPay: 5200.5,
    status: "Paid",
    deductions: 1299.5,
  },
  {
    key: "2",
    payPeriod: "September 2023",
    issueDate: "2023-09-30",
    grossPay: 6500.0,
    netPay: 5180.25,
    status: "Paid",
    deductions: 1319.75,
  },
  {
    key: "3",
    payPeriod: "August 2023",
    issueDate: "2023-08-31",
    grossPay: 6500.0,
    netPay: 5215.75,
    status: "Paid",
    deductions: 1284.25,
  },
  {
    key: "4",
    payPeriod: "July 2023",
    issueDate: "2023-07-31",
    grossPay: 6200.0,
    netPay: 4980.5,
    status: "Paid",
    deductions: 1219.5,
  },
  {
    key: "5",
    payPeriod: "June 2023",
    issueDate: "2023-06-30",
    grossPay: 6200.0,
    netPay: 4972.25,
    status: "Paid",
    deductions: 1227.75,
  },
];

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
const usePayslips = (payslipData: Payslip[]) => {
  const [filteredData, setFilteredData] = useState<Payslip[]>(payslipData);
  const [filters, setFilters] = useState<PayslipFilters>({
    searchText: "",
    searchYear: "2023",
  });

  const filterData = (searchText: string, year: string) => {
    const filtered = payslipData.filter((item: Payslip) => {
      const matchesText = item.payPeriod
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesYear = item.issueDate.includes(year);
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

// TanStack Query Hook
const usePayslipsQuery = () => {
  // Simulate API delay for demonstration
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchPayslips = async (): Promise<Payslip[]> => {
    // Simulate API call delay
    await delay(1000);

    // For now, return mock data
    // In a real application, you would replace this with an actual API call:
    /*
    const response = await fetch('/api/payslips');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
    */

    return payslipData;
  };

  return useQuery({
    queryKey: ["payslips"],
    queryFn: fetchPayslips,
    // Use mock data as initial data while the real data is loading
    initialData: payslipData,
  });
};

// Main Component
const EmployeePayslip: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Use TanStack Query to fetch payslips
  const { data: payslipData, isLoading, error } = usePayslipsQuery();

  // Use our custom hook for filtering
  const { filteredData, filters, handleSearch, handleYearFilter } = usePayslips(
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
            title: "Home",
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
            earnings={earningsData}
            deductions={deductionsData}
          />
        </>
      )}
    </Wrapper>
  );
};

export default EmployeePayslip;
