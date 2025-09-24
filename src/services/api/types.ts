// Common API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  detail: string;
  status: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface FilterParams {
  status?: string;
  department?: string;
  employee_id?: number;
  year?: number;
  month?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'hr' | 'team_lead' | 'employee';
  is_active: boolean;
}

// Employee Types
export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  join_date: string;
  supervisor_id?: number;
  phone?: string;
  address?: string;
}

// Leave Types
export interface Leave {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_by?: number;
  approved_at?: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  total_hours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

// Asset Types
export interface Asset {
  id: number;
  name: string;
  asset_type: string;
  serial_number: string;
  status: 'available' | 'assigned' | 'maintenance';
  assigned_to?: number;
  assignment_date?: string;
  specifications?: string;
}

export interface AssetRequest {
  id: number;
  employee_id: number;
  asset_id?: number;
  asset_type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Complaint Types
export interface Complaint {
  id: number;
  employee_id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  assigned_to?: number;
}

// Document Types
export interface Document {
  id: number;
  employee_id: number;
  document_type: string;
  file_name: string;
  file_size: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  upload_date: string;
  description?: string;
}

// Performance Types
export interface Performance {
  id: number;
  employee_id: number;
  reviewer_id: number;
  review_period: string;
  overall_rating: number;
  status: 'draft' | 'submitted' | 'approved' | 'completed';
  comments: string;
  goals: string;
  strengths: string;
  areas_for_improvement: string;
  created_at: string;
}

// Training Types
export interface TrainingProgram {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface TrainingEnrollment {
  id: number;
  employee_id: number;
  program_id: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  progress: number;
  enrolled_at: string;
}

// Health Insurance Types
export interface HealthInsurancePolicy {
  id: number;
  employee_id: number;
  policy_number: string;
  plan_type: string;
  coverage_amount: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
}

export interface InsuranceClaim {
  id: number;
  employee_id: number;
  claim_number: string;
  patient_name: string;
  claim_type: string;
  treatment_date: string;
  total_bill_amount: number;
  claimed_amount: number;
  status: 'submitted' | 'approved' | 'rejected';
  submitted_date: string;
}

// Payroll Types
export interface Payslip {
  id: number;
  employee_id: number;
  pay_period: string;
  gross_pay: number;
  total_deductions: number;
  net_pay: number;
  status: 'draft' | 'finalized';
  generated_at: string;
}

// Request Types
export interface EmployeeRequest {
  id: number;
  employee_id: number;
  request_type: 'loan' | 'document' | 'leave' | 'equipment' | 'travel' | 'recognition';
  subject: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  amount?: number;
}

// Dashboard Stats Types
export interface AdminDashboardStats {
  employees: {
    total: number;
    active: number;
    on_leave_today: number;
  };
  attendance: {
    present_today: number;
    attendance_rate: number;
  };
  leaves: {
    pending: number;
    approved_this_month: number;
  };
  requests: {
    pending: number;
  };
  complaints: {
    pending: number;
  };
}

export interface EmployeeDashboardStats {
  leave_balance: {
    used_days: number;
    remaining_days: number;
  };
  attendance: {
    present_days: number;
    total_working_days: number;
    attendance_rate: number;
  };
  requests: {
    pending: number;
  };
  training: {
    completed: number;
    total: number;
    completion_rate: number;
  };
}