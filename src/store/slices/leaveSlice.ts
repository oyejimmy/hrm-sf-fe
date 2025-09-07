import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  emergency_contact?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeaveState {
  leaveRequests: LeaveRequest[];
  currentLeaveRequest: LeaveRequest | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaveRequests: [],
  currentLeaveRequest: null,
  isLoading: false,
  error: null,
};

// Async thunks would go here
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      // API call would go here
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentLeaveRequest: (state, action: PayloadAction<LeaveRequest>) => {
      state.currentLeaveRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentLeaveRequest } = leaveSlice.actions;
export { leaveSlice };
