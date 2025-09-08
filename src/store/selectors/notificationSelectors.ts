import { RootState } from '../index';

export const selectNotification = (state: RootState) => state.notification;
export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) => state.notification.unreadCount;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;
export const selectNotificationError = (state: RootState) => state.notification.error;

export const selectUnreadNotifications = (state: RootState) =>
  state.notification.notifications.filter(notif => !notif.read);

export const selectReadNotifications = (state: RootState) =>
  state.notification.notifications.filter(notif => notif.read);

export const selectNotificationsByType = (type: string) => (state: RootState) =>
  state.notification.notifications.filter(notif => notif.type === type);
