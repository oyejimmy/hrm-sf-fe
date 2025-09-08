export interface Payslip {
  id: string;
  month: string;
  year: number;
  earnings: {
    basic: number;
    hra: number;
    bonus: number;
    allowances: number;
  };
  deductions: {
    tax: number;
    pf: number;
    loan: number;
    others: number;
  };
  netPay: number;
  status: "Paid" | "Pending";
}
