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
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'admin' | 'hr' | 'team_lead' | 'employee';
  is_active?: boolean;
  is_profile_complete?: boolean;
  profile_picture?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  redirect_url?: string;
  temp_password?: string;
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
  instructor?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  type?: 'video' | 'reading' | 'interactive';
  rating?: number;
  enrolled_count?: number;
  thumbnail?: string;
  prerequisites?: string;
  learning_objectives?: string[];
  materials?: string[];
}

export interface TrainingEnrollment {
  id: number;
  employee_id: number;
  program_id: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  certificate_url?: string;
  program?: TrainingProgram;
  employee_name?: string;
}

export interface TrainingSession {
  id: number;
  program_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  instructor: string;
  location?: string;
  max_participants: number;
  enrolled_count: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface TrainingCertificate {
  id: number;
  enrollment_id: number;
  certificate_number: string;
  issued_date: string;
  expiry_date?: string;
  status: 'active' | 'expired';
  certificate_url: string;
}

export interface TrainingStats {
  total_programs: number;
  active_programs: number;
  total_enrollments: number;
  completed_trainings: number;
  in_progress_trainings: number;
  completion_rate: number;
  popular_categories: { category: string; count: number }[];
  monthly_completions: number[];
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
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  basic_salary: number;
  gross_salary: number;
  net_salary: number;
  total_earnings: number;
  total_deductions: number;
  status: 'generated' | 'approved' | 'paid';
  payslip_number: string;
  generated_by: number;
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at?: string;
  earnings?: PayslipEarning[];
  deductions?: PayslipDeduction[];
  employee_name?: string;
}

export interface PayslipEarning {
  type: string;
  amount: number;
  description?: string;
}

export interface PayslipDeduction {
  type: string;
  amount: number;
  description?: string;
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
  departments: {
    name: string;
    total_members: number;
  }[];
  recent_notifications: {
    id: number;
    title: string;
    message: string;
    type: string;
    priority: string;
    is_read: boolean;
    created_at: string;
  }[];
  recent_announcements: {
    id: number;
    title: string;
    content: string;
    announcement_type: string;
    priority: string;
    created_at: string;
  }[];
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

export interface AttendanceReport {
  monthly_rates: number[];
}