import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  position: string;
  manager_id?: string;
  hire_date: string;
  employment_status: string;
  salary?: number;
  work_location?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

interface EmployeeState {
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

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    setCurrentEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.currentEmployee = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setEmployees,
  setCurrentEmployee,
  addEmployee,
  updateEmployee,
  removeEmployee,
  clearError,
} = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;