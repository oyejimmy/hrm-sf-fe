import { NotificationType, NotificationStatus } from '../../constants/enums';

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  created_at: string;
  updated_at: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const notificationReducer = (state = initialState, action: any): NotificationState => {
  switch (action.type) {
    case 'NOTIFICATION_FETCH_REQUEST':
    case 'NOTIFICATION_SEND_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'NOTIFICATION_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        notifications: action.payload,
        unreadCount: action.payload.filter((n: Notification) => n.status === 'unread').length,
        error: null,
      };
      
    case 'NOTIFICATION_SEND_SUCCESS':
      return {
        ...state,
        isLoading: false,
        notifications: [action.payload, ...state.notifications],
        error: null,
      };
      
    case 'NOTIFICATION_MARK_READ_SUCCESS':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, status: NotificationStatus.READ } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
      
    case 'NOTIFICATION_ADD':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.status === NotificationStatus.UNREAD ? state.unreadCount + 1 : state.unreadCount,
      };
      
    case 'NOTIFICATION_FETCH_FAILURE':
    case 'NOTIFICATION_SEND_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      
    case 'NOTIFICATION_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};
