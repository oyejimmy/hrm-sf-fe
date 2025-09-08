import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  days_requested: number;
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  user_id: string;
  annual_leave_balance: number;
  sick_leave_balance: number;
  total_leave_taken: number;
  year: number;
}

interface LeaveState {
  requests: LeaveRequest[];
  myRequests: LeaveRequest[];
  pendingRequests: LeaveRequest[];
  balance: LeaveBalance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  requests: [],
  myRequests: [],
  pendingRequests: [],
  balance: null,
  isLoading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRequests: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.requests = action.payload;
    },
    setMyRequests: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.myRequests = action.payload;
    },
    setPendingRequests: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.pendingRequests = action.payload;
    },
    setBalance: (state, action: PayloadAction<LeaveBalance | null>) => {
      state.balance = action.payload;
    },
    addRequest: (state, action: PayloadAction<LeaveRequest>) => {
      state.myRequests.unshift(action.payload);
      state.requests.unshift(action.payload);
    },
    updateRequest: (state, action: PayloadAction<LeaveRequest>) => {
      const updateArrays = [state.requests, state.myRequests, state.pendingRequests];
      updateArrays.forEach(array => {
        const index = array.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          array[index] = action.payload;
        }
      });
    },
    removeFromPending: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setRequests,
  setMyRequests,
  setPendingRequests,
  setBalance,
  addRequest,
  updateRequest,
  removeFromPending,
  clearError,
} = leaveSlice.actions;

export const leaveReducer = leaveSlice.reducer;