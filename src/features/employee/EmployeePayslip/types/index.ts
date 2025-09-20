// components/EmployeePayslip/types/index.ts
export interface Payslip {
  key: string;
  payPeriod: string;
  issueDate: string;
  grossPay: number;
  netPay: number;
  status: string;
  deductions: number;
}

export interface Earnings {
  type: string;
  amount: number;
}

export interface Deductions {
  type: string;
  amount: number;
}

export interface PayslipFilters {
  searchText: string;
  searchYear: string;
}