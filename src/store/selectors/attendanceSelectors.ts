import { RootState } from '../index';

export const selectAttendance = (state: RootState) => state.attendance;
export const selectAttendanceList = (state: RootState) => state.attendance.attendance;
export const selectCurrentAttendance = (state: RootState) => state.attendance.currentAttendance;
export const selectAttendanceLoading = (state: RootState) => state.attendance.isLoading;
export const selectAttendanceError = (state: RootState) => state.attendance.error;

export const selectAttendanceByDate = (date: string) => (state: RootState) =>
  state.attendance.attendance.find(att => att.date === date);

export const selectAttendanceByUser = (userId: string) => (state: RootState) =>
  state.attendance.attendance.filter(att => att.user_id === userId);

export const selectTodayAttendance = (state: RootState) => {
  const today = new Date().toISOString().split('T')[0];
  return state.attendance.attendance.find(att => att.date === today);
};
