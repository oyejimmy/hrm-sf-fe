import { RootState } from '../index';

export const selectAttendance = (state: RootState) => state.attendance;
export const selectAttendanceList = (state: RootState) => state.attendance.records;
export const selectCurrentAttendance = (state: RootState) => state.attendance.todayRecords;
export const selectAttendanceLoading = (state: RootState) => state.attendance.isLoading;
export const selectAttendanceError = (state: RootState) => state.attendance.error;

export const selectAttendanceByDate = (date: string) => (state: RootState) =>
  state.attendance.records.find((att: any) => att.date === date);

export const selectAttendanceByUser = (userId: string) => (state: RootState) =>
  state.attendance.records.filter((att: any) => att.user_id === userId);

export const selectTodayAttendance = (state: RootState) => {
  const today = new Date().toISOString().split('T')[0];
  return state.attendance.records.find((att: any) => att.date === today);
};
