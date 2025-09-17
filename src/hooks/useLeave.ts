import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '../services/api/leaveApi';
import { message } from 'antd';

export const useLeave = () => {
  const queryClient = useQueryClient();

  const leaveRequestsQuery = useQuery({
    queryKey: ['leave', 'requests'],
    queryFn: leaveApi.getMyLeaveRequests,
  });

  const leaveBalanceQuery = useQuery({
    queryKey: ['leave', 'balance'],
    queryFn: () => leaveApi.getLeaveBalance('current-user'),
  });

  const pendingRequestsQuery = useQuery({
    queryKey: ['leave', 'pending'],
    queryFn: leaveApi.getPendingLeaveRequests,
  });

  const createLeaveRequestMutation = useMutation({
    mutationFn: leaveApi.createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      message.success('Leave request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit leave request');
    },
  });

  const approveLeaveRequestMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => 
      leaveApi.approveLeaveRequest(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      message.success('Leave request processed successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to process leave request');
    },
  });

  return {
    leaveRequests: leaveRequestsQuery.data,
    leaveBalance: leaveBalanceQuery.data,
    pendingRequests: pendingRequestsQuery.data,
    isLoading: leaveRequestsQuery.isLoading || leaveBalanceQuery.isLoading,
    createLeaveRequest: createLeaveRequestMutation.mutate,
    approveLeaveRequest: approveLeaveRequestMutation.mutate,
    isCreatingRequest: createLeaveRequestMutation.isPending,
    isProcessingRequest: approveLeaveRequestMutation.isPending,
  };
};