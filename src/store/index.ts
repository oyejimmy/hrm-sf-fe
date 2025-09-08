import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { employeeReducer } from './reducers/employeeReducer';
import { attendanceReducer } from './reducers/attendanceReducer';
import { leaveReducer } from './reducers/leaveReducer';
import { notificationReducer } from './reducers/notificationReducer';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
