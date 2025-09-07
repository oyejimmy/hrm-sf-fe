import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  position: string;
  employment_status: string;
  hire_date: string;
  salary?: number;
  manager_id?: string;
  work_location?: string;
  work_schedule?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  isLoading: false,
  error: null,
};

// Async thunks would go here
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      // API call would go here
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEmployee: (state, action: PayloadAction<Employee>) => {
      state.currentEmployee = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentEmployee } = employeeSlice.actions;
export { employeeSlice };
