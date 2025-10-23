import api from './api';

export interface TrainingProgram {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  instructor?: string;
  max_participants?: number;
  prerequisites?: string;
  learning_objectives?: string[];
  materials?: string[];
  is_mandatory: boolean;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at?: string;
}

export interface TrainingEnrollment {
  id: number;
  employee_id: number;
  program_id: number;
  session_id?: number;
  enrollment_date: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress_percentage: number;
  completion_date?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  feedback_rating?: number;
  feedback_comments?: string;
  assigned_by?: number;
  created_at: string;
  updated_at?: string;
  program?: TrainingProgram;
}

export interface TrainingRoadmap {
  id: number;
  title: string;
  description?: string;
  department_id?: number;
  position?: string;
  milestones: Array<{
    id: string;
    topic: string;
    description: string;
    resources: string[];
    estimatedTime: string;
    completed: boolean;
  }>;
  estimated_duration_months?: number;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at?: string;
}

export interface TrainingStats {
  total_programs: number;
  active_programs: number;
  total_enrollments: number;
  completed_trainings: number;
}

export interface CreateTrainingProgramData {
  title: string;
  description?: string;
  category: string;
  level: string;
  duration_hours: number;
  instructor?: string;
  max_participants?: number;
  prerequisites?: string;
  learning_objectives?: string[];
  materials?: string[];
  is_mandatory?: boolean;
}

export interface UpdateTrainingProgramData {
  title?: string;
  description?: string;
  instructor?: string;
  is_active?: boolean;
}

export interface EnrollInTrainingData {
  program_id: number;
  employee_id?: number;
}

export interface UpdateProgressData {
  progress: number;
}

// Training Programs API
export const getTrainingPrograms = async (params?: {
  skip?: number;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<TrainingProgram[]> => {
  const response = await api.get('/api/training/programs/', { params });
  return response.data;
};

export const getTrainingProgram = async (programId: number): Promise<TrainingProgram> => {
  const response = await api.get(`/api/training/programs/${programId}`);
  return response.data;
};

export const createTrainingProgram = async (data: CreateTrainingProgramData): Promise<TrainingProgram> => {
  const response = await api.post('/api/training/programs/', data);
  return response.data;
};

export const updateTrainingProgram = async (
  programId: number,
  data: UpdateTrainingProgramData
): Promise<TrainingProgram> => {
  const response = await api.put(`/api/training/programs/${programId}`, data);
  return response.data;
};

export const deleteTrainingProgram = async (programId: number): Promise<void> => {
  await api.delete(`/api/training/programs/${programId}`);
};

// Training Enrollments API
export const getTrainingEnrollments = async (params?: {
  skip?: number;
  limit?: number;
  employee_id?: number;
  program_id?: number;
  status?: string;
}): Promise<TrainingEnrollment[]> => {
  const response = await api.get('/api/training/enrollments/', { params });
  return response.data;
};

export const getMyTrainings = async (): Promise<TrainingEnrollment[]> => {
  const response = await api.get('/api/training/my-trainings/');
  return response.data;
};

export const enrollInTraining = async (data: EnrollInTrainingData): Promise<TrainingEnrollment> => {
  const response = await api.post('/api/training/enrollments/', data);
  return response.data;
};

export const updateTrainingProgress = async (
  enrollmentId: number,
  data: UpdateProgressData
): Promise<void> => {
  await api.put(`/api/training/enrollments/${enrollmentId}/progress`, data);
};

export const completeTraining = async (enrollmentId: number): Promise<void> => {
  await api.put(`/api/training/enrollments/${enrollmentId}/complete`);
};

// Training Roadmaps API
export const getTrainingRoadmaps = async (params?: {
  skip?: number;
  limit?: number;
  department?: string;
  role?: string;
}): Promise<TrainingRoadmap[]> => {
  const response = await api.get('/api/training/roadmaps/', { params });
  return response.data;
};

export const getTrainingRoadmap = async (roadmapId: number): Promise<TrainingRoadmap> => {
  const response = await api.get(`/api/training/roadmaps/${roadmapId}`);
  return response.data;
};

export const createTrainingRoadmap = async (data: {
  title: string;
  description?: string;
  department_id?: number;
  position?: string;
  milestones: Array<{
    id: string;
    topic: string;
    description: string;
    resources: string[];
    estimatedTime: string;
    completed: boolean;
  }>;
  estimated_duration_months?: number;
}): Promise<TrainingRoadmap> => {
  const response = await api.post('/api/training/roadmaps/', data);
  return response.data;
};

// Training Statistics API
export const getTrainingStats = async (): Promise<TrainingStats> => {
  const response = await api.get('/api/training/stats/overview');
  return response.data;
};
