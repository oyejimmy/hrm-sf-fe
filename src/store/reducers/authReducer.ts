import { UserRole, UserStatus } from '../../constants/enums';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  team_id?: string;
  phone?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case 'AUTH_LOGIN_REQUEST':
    case 'AUTH_SIGNUP_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        error: null,
      };
      
    case 'AUTH_SIGNUP_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
      
    case 'AUTH_LOGIN_FAILURE':
    case 'AUTH_SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        error: action.payload,
      };
      
    case 'AUTH_GET_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      
    case 'AUTH_REFRESH_SUCCESS':
      return {
        ...state,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      };
      
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};
