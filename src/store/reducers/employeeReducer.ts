import { EmploymentStatus, Department, PositionLevel } from '../../constants/enums';

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  department: Department;
  position: string;
  position_level: PositionLevel;
  employment_status: EmploymentStatus;
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

export const employeeReducer = (state = initialState, action: any): EmployeeState => {
  switch (action.type) {
    case 'EMPLOYEE_FETCH_REQUEST':
    case 'EMPLOYEE_CREATE_REQUEST':
    case 'EMPLOYEE_UPDATE_REQUEST':
    case 'EMPLOYEE_DELETE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'EMPLOYEE_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        employees: action.payload,
        error: null,
      };
      
    case 'EMPLOYEE_CREATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        employees: [...state.employees, action.payload],
        error: null,
      };
      
    case 'EMPLOYEE_UPDATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        ),
        error: null,
      };
      
    case 'EMPLOYEE_DELETE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        employees: state.employees.filter(emp => emp.id !== action.payload),
        error: null,
      };
      
    case 'EMPLOYEE_FETCH_FAILURE':
    case 'EMPLOYEE_CREATE_FAILURE':
    case 'EMPLOYEE_UPDATE_FAILURE':
    case 'EMPLOYEE_DELETE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case 'EMPLOYEE_SET_CURRENT':
      return {
        ...state,
        currentEmployee: action.payload,
      };
      
    case 'EMPLOYEE_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};
