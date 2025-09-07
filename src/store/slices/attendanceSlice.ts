import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
  work_hours?: number;
  overtime_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceState {
  attendance: Attendance[];
  currentAttendance: Attendance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  attendance: [],
  currentAttendance: null,
  isLoading: false,
  error: null,
};

// Async thunks would go here
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      // API call would go here
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAttendance: (state, action: PayloadAction<Attendance>) => {
      state.currentAttendance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentAttendance } = attendanceSlice.actions;
export { attendanceSlice };
