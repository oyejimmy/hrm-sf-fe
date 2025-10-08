import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '../services/api/leaveApi';
import { message } from 'antd';

export const useLeave = () => {
  const queryClient = useQueryClient();

  const leaveRequestsQuery = useQuery({
    queryKey: ['leave', 'requests'],
    queryFn: leaveApi.getMyLeaveRequests,
  });

  const allLeaveRequestsQuery = useQuery({
    queryKey: ['leave', 'all'],
    queryFn: leaveApi.getAllLeaveRequests,
  });

  // Leave balance query disabled for now - API endpoint not implemented
  // const leaveBalanceQuery = useQuery({
  //   queryKey: ['leave', 'balance'],
  //   queryFn: () => leaveApi.getLeaveBalance('current-user'),
  // });

  const pendingRequestsQuery = useQuery({
    queryKey: ['leave', 'pending'],
    queryFn: leaveApi.getPendingLeaveRequests,
  });

  const createLeaveRequestMutation = useMutation({
    mutationFn: leaveApi.createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['all-leaves'] });
      message.success('Leave request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit leave request');
    },
  });

  const approveLeaveRequestMutation = useMutation({
    mutationFn: (id: string) => leaveApi.approveLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['all-leaves'] });
      message.success('Leave request approved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to approve leave request');
    },
  });

  const rejectLeaveRequestMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      leaveApi.rejectLeaveRequest(id, { status: 'rejected', rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['all-leaves'] });
      message.success('Leave request rejected successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to reject leave request');
    },
  });

  return {
    leaveRequests: leaveRequestsQuery.data,
    allLeaveRequests: allLeaveRequestsQuery.data,
    leaveBalance: null, // leaveBalanceQuery.data,
    pendingRequests: pendingRequestsQuery.data,
    isLoading: leaveRequestsQuery.isLoading, // || leaveBalanceQuery.isLoading,
    isLoadingAll: allLeaveRequestsQuery.isLoading,
    createLeaveRequest: createLeaveRequestMutation.mutate,
    approveLeaveRequest: approveLeaveRequestMutation.mutate,
    rejectLeaveRequest: rejectLeaveRequestMutation.mutate,
    isCreatingRequest: createLeaveRequestMutation.isPending,
    isProcessingRequest: approveLeaveRequestMutation.isPending,
    isRejectingRequest: rejectLeaveRequestMutation.isPending,
  };
};