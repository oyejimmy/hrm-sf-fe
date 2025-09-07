import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { authReducer } from './reducers/authReducer';
import { employeeReducer } from './reducers/employeeReducer';
import { attendanceReducer } from './reducers/attendanceReducer';
import { leaveReducer } from './reducers/leaveReducer';
import { notificationReducer } from './reducers/notificationReducer';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  employee: employeeReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  notification: notificationReducer,
});

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
