import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../services/api';
import { Request, RequestLog, UserRole } from '../types';
import { showConfirmModal } from '../components/ConfirmModal';

export const useRequestActions = (userRole: UserRole, refetchLogs: () => void) => {
  const queryClient = useQueryClient();

  const updateRequestMutation = useMutation({
    mutationFn: ({ requestId, updates }: { requestId: string; updates: Partial<Request> }) =>
      mockApi.updateRequest(requestId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      refetchLogs();
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: (request: Omit<Request, 'id'>) => mockApi.createRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      refetchLogs();
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: string) => mockApi.deleteRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      refetchLogs();
    },
  });

  const createLogMutation = useMutation({
    mutationFn: (log: Omit<RequestLog, 'id'>) => mockApi.createLog(log),
    onSuccess: () => refetchLogs(),
  });

  const handleApprove = (requestId: string) => {
    updateRequestMutation.mutate({
      requestId,
      updates: { status: 'approved', approver: 'Manager Name' },
    });
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: 'APPROVE',
      performedBy: userRole,
      details: `Approved request ${requestId}`,
    });
    message.success('Request approved successfully!');
  };

  const handleReject = (requestId: string, comments: string) => {
    updateRequestMutation.mutate({
      requestId,
      updates: { status: 'rejected', approverComments: comments },
    });
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: 'REJECT',
      performedBy: userRole,
      details: `Rejected request ${requestId} with comments: ${comments}`,
    });
    message.warning('Request rejected.');
  };

  const handleDelete = (requestId: string) => {
    showConfirmModal({
      title: 'Delete Request',
      content: 'Are you sure you want to delete this request? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onConfirm: () => {
        deleteRequestMutation.mutate(requestId);
        createLogMutation.mutate({
          timestamp: new Date().toISOString(),
          action: 'DELETE',
          performedBy: userRole,
          details: `Deleted request ${requestId}`,
        });
        message.success('Request deleted successfully!');
      },
    });
  };

  const handleRequestSubmit = (values: any) => {
    const newRequest: Omit<Request, 'id'> = {
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      ...values,
    };

    createRequestMutation.mutate(newRequest);
    createLogMutation.mutate({
      timestamp: new Date().toISOString(),
      action: 'CREATE',
      performedBy: 'Employee',
      details: `Created request (${values.type})`,
    });
    message.success('Request submitted successfully!');
  };

  return {
    handleApprove,
    handleReject,
    handleDelete,
    handleRequestSubmit,
    isCreating: createRequestMutation.isPending,
  };
};