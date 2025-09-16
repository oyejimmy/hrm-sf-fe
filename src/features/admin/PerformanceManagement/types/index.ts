export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
}

export interface Reviewer {
  id: string;
  name: string;
  role: string;
}

export interface Assessment {
  communication: number;
  teamwork: number;
  problemSolving: number;
  technicalSkills: number;
  initiative: number;
  attendance: number;
  goalAchievement: number;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Completed';
  assessment: Assessment;
  overallRating: number;
  comments: string;
  goals: string;
  strengths: string;
  areasForImprovement: string;
  createdAt: string;
  updatedAt: string;
  employeeSignature?: string;
  reviewerSignature?: string;
}

export interface FilterOptions {
  employee?: string;
  department?: string;
  reviewer?: string;
  reviewPeriod?: string;
  status?: string;
  dateRange?: any | null;
}

export interface PerformanceStats {
  total: number;
  completed: number;
  inProgress: number;
  averageRating: number;
}

export interface PerformanceTableProps {
  reviews: PerformanceReview[];
  onViewReview: (review: PerformanceReview) => void;
  onEditReview: (review: PerformanceReview) => void;
  onDeleteReview: (id: string) => void;
}

export interface PerformanceModalProps {
  visible: boolean;
  editingReview: PerformanceReview | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  employees: Employee[];
  reviewers: Reviewer[];
}