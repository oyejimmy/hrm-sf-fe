export interface PerformanceReview {
  id?: number;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewer: string;
  reviewPeriod: string;
  communication: number;
  teamwork: number;
  problemSolving: number;
  technicalSkills: number;
  initiative: number;
  attendance: number;
  goalAchievement: number;
  overallRating: number;
  comments: string;
  status: "Draft" | "Submitted" | "Finalized";
  createdAt: string;
}
