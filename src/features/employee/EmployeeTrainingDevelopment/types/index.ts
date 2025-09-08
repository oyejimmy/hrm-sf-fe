// Training and Development types
export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  instructor: string;
  startDate: string;
  endDate: string;
}

export interface TrainingAssignment {
  id: string;
  courseId: string;
  userId: string;
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
}

export {};