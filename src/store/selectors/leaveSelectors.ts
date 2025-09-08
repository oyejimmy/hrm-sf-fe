import { RootState } from '../index';

export const selectLeave = (state: RootState) => state.leave;
export const selectLeaveRequests = (state: RootState) => state.leave.requests;
export const selectCurrentLeaveRequest = (state: RootState) => state.leave.myRequests;
export const selectLeaveLoading = (state: RootState) => state.leave.isLoading;
export const selectLeaveError = (state: RootState) => state.leave.error;

export const selectLeaveRequestById = (id: string) => (state: RootState) =>
  state.leave.requests.find((leave: any) => leave.id === id);

export const selectLeaveRequestsByUser = (userId: string) => (state: RootState) =>
  state.leave.requests.filter((leave: any) => leave.user_id === userId);

export const selectPendingLeaveRequests = (state: RootState) =>
  state.leave.pendingRequests;

export const selectApprovedLeaveRequests = (state: RootState) =>
  state.leave.requests.filter((leave: any) => leave.status === 'approved');
