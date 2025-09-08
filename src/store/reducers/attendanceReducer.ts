import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: string;
  work_hours?: number;
  overtime_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSummary {
  user_id: string;
  month: number;
  year: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  half_days: number;
  total_work_hours: number;
  total_overtime_hours: number;
  attendance_percentage: number;
}

interface AttendanceState {
  records: AttendanceRecord[];
  todayRecords: AttendanceRecord[];
  summary: AttendanceSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  todayRecords: [],
  summary: null,
  isLoading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.records = action.payload;
    },
    setTodayRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.todayRecords = action.payload;
    },
    setSummary: (state, action: PayloadAction<AttendanceSummary | null>) => {
      state.summary = action.payload;
    },
    addRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.unshift(action.payload);
    },
    updateRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setRecords,
  setTodayRecords,
  setSummary,
  addRecord,
  updateRecord,
  clearError,
} = attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;