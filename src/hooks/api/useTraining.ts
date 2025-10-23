import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { TrainingProgram, TrainingEnrollment } from '../../services/api/types';

// Training Programs
export const useTrainingPrograms = () => {
  return useQuery({
    queryKey: ['training-programs'],
    queryFn: async (): Promise<TrainingProgram[]> => {
      const response = await api.get(API_ENDPOINTS.TRAINING.PROGRAMS);
      return response.data;
    },
  });
};

export const useCreateTrainingProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<TrainingProgram, 'id' | 'created_at'>) => {
      const response = await api.post(API_ENDPOINTS.TRAINING.PROGRAMS, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      message.success('Training program created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to create training program');
    },
  });
};

export const useUpdateTrainingProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TrainingProgram> }) => {
      const response = await api.put(`${API_ENDPOINTS.TRAINING.PROGRAMS}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      message.success('Training program updated successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update training program');
    },
  });
};

export const useDeleteTrainingProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${API_ENDPOINTS.TRAINING.PROGRAMS}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      message.success('Training program deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to delete training program');
    },
  });
};

// Training Enrollments
export const useMyTrainings = () => {
  return useQuery({
    queryKey: ['my-trainings'],
    queryFn: async (): Promise<TrainingEnrollment[]> => {
      const response = await api.get(API_ENDPOINTS.TRAINING.MY_TRAININGS);
      return response.data;
    },
  });
};

export const useTrainingEnrollments = () => {
  return useQuery({
    queryKey: ['training-enrollments'],
    queryFn: async (): Promise<TrainingEnrollment[]> => {
      const response = await api.get(API_ENDPOINTS.TRAINING.ENROLLMENTS);
      return response.data;
    },
  });
};

export const useEnrollInTraining = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { program_id: number; employee_id?: number }) => {
      const response = await api.post(API_ENDPOINTS.TRAINING.ENROLLMENTS, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trainings'] });
      queryClient.invalidateQueries({ queryKey: ['training-enrollments'] });
      message.success('Successfully enrolled in training program');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to enroll in training program');
    },
  });
};

export const useUpdateTrainingProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, progress }: { id: number; progress: number }) => {
      const response = await api.put(`${API_ENDPOINTS.TRAINING.ENROLLMENTS}/${id}/progress`, { progress });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trainings'] });
      queryClient.invalidateQueries({ queryKey: ['training-enrollments'] });
      message.success('Training progress updated');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to update progress');
    },
  });
};

export const useCompleteTraining = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put(`${API_ENDPOINTS.TRAINING.ENROLLMENTS}/${id}/complete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trainings'] });
      queryClient.invalidateQueries({ queryKey: ['training-enrollments'] });
      message.success('Training completed successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to complete training');
    },
  });
};

// Training Stats
export const useTrainingStats = () => {
  return useQuery({
    queryKey: ['training-stats'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.TRAINING.STATS);
      return response.data;
    },
  });
};