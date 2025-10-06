// components/EmployeePayslip/types/index.ts
export interface PayslipFilters {
  searchText: string;
  searchYear: string;
}

export interface PayslipStats {
  totalPayslips: number;
  totalEarnings: number;
  totalDeductions: number;
  avgNetPay: number;
}