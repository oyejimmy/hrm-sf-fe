import { AttendanceStatus } from '../../constants/enums';

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
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

export const attendanceReducer = (state = initialState, action: any): AttendanceState => {
  switch (action.type) {
    case 'ATTENDANCE_FETCH_REQUEST':
    case 'ATTENDANCE_LOG_REQUEST':
    case 'ATTENDANCE_UPDATE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'ATTENDANCE_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        attendance: action.payload,
        error: null,
      };
      
    case 'ATTENDANCE_LOG_SUCCESS':
      return {
        ...state,
        isLoading: false,
        attendance: [...state.attendance, action.payload],
        error: null,
      };
      
    case 'ATTENDANCE_UPDATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        attendance: state.attendance.map(att => 
          att.id === action.payload.id ? action.payload : att
        ),
        error: null,
      };
      
    case 'ATTENDANCE_FETCH_FAILURE':
    case 'ATTENDANCE_LOG_FAILURE':
    case 'ATTENDANCE_UPDATE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case 'ATTENDANCE_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};
