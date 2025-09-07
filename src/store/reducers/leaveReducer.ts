import { LeaveType, LeaveStatus } from '../../constants/enums';

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
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

export const leaveReducer = (state = initialState, action: any): LeaveState => {
  switch (action.type) {
    case 'LEAVE_FETCH_REQUEST':
    case 'LEAVE_CREATE_REQUEST':
    case 'LEAVE_APPROVE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'LEAVE_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        leaveRequests: action.payload,
        error: null,
      };
      
    case 'LEAVE_CREATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        leaveRequests: [...state.leaveRequests, action.payload],
        error: null,
      };
      
    case 'LEAVE_APPROVE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        leaveRequests: state.leaveRequests.map(leave => 
          leave.id === action.payload.id ? action.payload : leave
        ),
        error: null,
      };
      
    case 'LEAVE_FETCH_FAILURE':
    case 'LEAVE_CREATE_FAILURE':
    case 'LEAVE_APPROVE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case 'LEAVE_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};
