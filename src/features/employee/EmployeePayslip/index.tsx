import React, { useState } from "react";
import PayslipSummary from "./components/PayslipSummary";
import PayslipHistoryTable from "./components/PayslipHistoryTable";
import PayslipDetailsModal from "./components/PayslipDetailsModal";
import { PageWrapper } from "./components/styles";
import { Payslip } from "./types";

const EmployeePayslipPage: React.FC = () => {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const payslips: Payslip[] = [
    {
      id: "1",
      month: "August",
      year: 2025,
      earnings: { basic: 40000, hra: 10000, bonus: 5000, allowances: 3000 },
      deductions: { tax: 8000, pf: 2000, loan: 0, others: 500 },
      netPay: 49500,
      status: "Paid",
    },
    {
      id: "2",
      month: "July",
      year: 2025,
      earnings: { basic: 40000, hra: 10000, bonus: 2000, allowances: 2500 },
      deductions: { tax: 7500, pf: 2000, loan: 1000, others: 300 },
      netPay: 46200,
      status: "Paid",
    },
    {
      id: "3",
      month: "June",
      year: 2025,
      earnings: { basic: 40000, hra: 10000, bonus: 0, allowances: 2000 },
      deductions: { tax: 7000, pf: 2000, loan: 0, others: 200 },
      netPay: 42800,
      status: "Pending",
    },
  ];

  const latestPayslip = payslips[0];

  const handleView = (p: Payslip) => {
    setSelectedPayslip(p);
    setModalVisible(true);
  };

  const handleDownload = (p: Payslip) => {
    console.log("Download payslip:", p);
    // Later integrate with backend PDF generation
  };

  return (
    <PageWrapper>
      <h2>Employee Payslip</h2>

      <PayslipSummary latestPayslip={latestPayslip} />

      <PayslipHistoryTable
        data={payslips}
        onView={handleView}
        onDownload={handleDownload}
      />

      <PayslipDetailsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        payslip={selectedPayslip}
      />
    </PageWrapper>
  );
};

export default EmployeePayslipPage;
