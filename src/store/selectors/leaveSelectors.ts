import { RootState } from '../index';

export const selectLeave = (state: RootState) => state.leave;
export const selectLeaveRequests = (state: RootState) => state.leave.leaveRequests;
export const selectCurrentLeaveRequest = (state: RootState) => state.leave.currentLeaveRequest;
export const selectLeaveLoading = (state: RootState) => state.leave.isLoading;
export const selectLeaveError = (state: RootState) => state.leave.error;

export const selectLeaveRequestById = (id: string) => (state: RootState) =>
  state.leave.leaveRequests.find(leave => leave.id === id);

export const selectLeaveRequestsByUser = (userId: string) => (state: RootState) =>
  state.leave.leaveRequests.filter(leave => leave.user_id === userId);

export const selectPendingLeaveRequests = (state: RootState) =>
  state.leave.leaveRequests.filter(leave => leave.status === 'pending');

export const selectApprovedLeaveRequests = (state: RootState) =>
  state.leave.leaveRequests.filter(leave => leave.status === 'approved');
