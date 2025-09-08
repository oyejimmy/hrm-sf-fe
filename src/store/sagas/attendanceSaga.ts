import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { attendanceApi } from '../../services/api/attendanceApi';

export const ATTENDANCE_ACTIONS = {
  FETCH_REQUEST: 'ATTENDANCE_FETCH_REQUEST',
  FETCH_SUCCESS: 'ATTENDANCE_FETCH_SUCCESS',
  FETCH_FAILURE: 'ATTENDANCE_FETCH_FAILURE',
  LOG_REQUEST: 'ATTENDANCE_LOG_REQUEST',
  LOG_SUCCESS: 'ATTENDANCE_LOG_SUCCESS',
  LOG_FAILURE: 'ATTENDANCE_LOG_FAILURE',
  UPDATE_REQUEST: 'ATTENDANCE_UPDATE_REQUEST',
  UPDATE_SUCCESS: 'ATTENDANCE_UPDATE_SUCCESS',
  UPDATE_FAILURE: 'ATTENDANCE_UPDATE_FAILURE',
  CLEAR_ERROR: 'ATTENDANCE_CLEAR_ERROR',
};

export const attendanceActions = {
  fetchRequest: (userId?: string) => ({ type: ATTENDANCE_ACTIONS.FETCH_REQUEST, payload: userId }),
  fetchSuccess: (attendance: any[]) => ({ type: ATTENDANCE_ACTIONS.FETCH_SUCCESS, payload: attendance }),
  fetchFailure: (error: string) => ({ type: ATTENDANCE_ACTIONS.FETCH_FAILURE, payload: error }),
  logRequest: (attendanceData: any) => ({ type: ATTENDANCE_ACTIONS.LOG_REQUEST, payload: attendanceData }),
  logSuccess: (attendance: any) => ({ type: ATTENDANCE_ACTIONS.LOG_SUCCESS, payload: attendance }),
  logFailure: (error: string) => ({ type: ATTENDANCE_ACTIONS.LOG_FAILURE, payload: error }),
  updateRequest: (id: string, attendanceData: any) => ({ type: ATTENDANCE_ACTIONS.UPDATE_REQUEST, payload: { id, data: attendanceData } }),
  updateSuccess: (attendance: any) => ({ type: ATTENDANCE_ACTIONS.UPDATE_SUCCESS, payload: attendance }),
  updateFailure: (error: string) => ({ type: ATTENDANCE_ACTIONS.UPDATE_FAILURE, payload: error }),
  clearError: () => ({ type: ATTENDANCE_ACTIONS.CLEAR_ERROR }),
};

function* fetchAttendanceSaga(action: PayloadAction<string | undefined>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call([attendanceApi, 'getTodayAttendance']);
    yield put(attendanceActions.fetchSuccess(response));
  } catch (error: any) {
    yield put(attendanceActions.fetchFailure(error.response?.data?.detail || 'Failed to fetch attendance'));
  }
}

function* logAttendanceSaga(action: PayloadAction<any>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call([attendanceApi, 'logAttendance'], action.payload);
    yield put(attendanceActions.logSuccess(response));
  } catch (error: any) {
    yield put(attendanceActions.logFailure(error.response?.data?.detail || 'Failed to log attendance'));
  }
}

function* updateAttendanceSaga(action: PayloadAction<{ id: string; data: any }>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call([attendanceApi, 'updateAttendance'], action.payload.id, action.payload.data);
    yield put(attendanceActions.updateSuccess(response));
  } catch (error: any) {
    yield put(attendanceActions.updateFailure(error.response?.data?.detail || 'Failed to update attendance'));
  }
}

export default function* attendanceSaga() {
  yield takeEvery(ATTENDANCE_ACTIONS.FETCH_REQUEST, fetchAttendanceSaga);
  yield takeEvery(ATTENDANCE_ACTIONS.LOG_REQUEST, logAttendanceSaga);
  yield takeEvery(ATTENDANCE_ACTIONS.UPDATE_REQUEST, updateAttendanceSaga);
}
