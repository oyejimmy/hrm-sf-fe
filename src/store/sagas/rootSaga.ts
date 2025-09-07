import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import employeeSaga from './employeeSaga';
import attendanceSaga from './attendanceSaga';
import leaveSaga from './leaveSaga';
import notificationSaga from './notificationSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(employeeSaga),
    fork(attendanceSaga),
    fork(leaveSaga),
    fork(notificationSaga),
  ]);
}
