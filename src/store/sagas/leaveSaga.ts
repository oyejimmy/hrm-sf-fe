import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { leaveApi } from '../../services/api/leaveApi';

export const LEAVE_ACTIONS = {
  FETCH_REQUEST: 'LEAVE_FETCH_REQUEST',
  FETCH_SUCCESS: 'LEAVE_FETCH_SUCCESS',
  FETCH_FAILURE: 'LEAVE_FETCH_FAILURE',
  CREATE_REQUEST: 'LEAVE_CREATE_REQUEST',
  CREATE_SUCCESS: 'LEAVE_CREATE_SUCCESS',
  CREATE_FAILURE: 'LEAVE_CREATE_FAILURE',
  APPROVE_REQUEST: 'LEAVE_APPROVE_REQUEST',
  APPROVE_SUCCESS: 'LEAVE_APPROVE_SUCCESS',
  APPROVE_FAILURE: 'LEAVE_APPROVE_FAILURE',
  CLEAR_ERROR: 'LEAVE_CLEAR_ERROR',
};

export const leaveActions = {
  fetchRequest: () => ({ type: LEAVE_ACTIONS.FETCH_REQUEST }),
  fetchSuccess: (leaveRequests: any[]) => ({ type: LEAVE_ACTIONS.FETCH_SUCCESS, payload: leaveRequests }),
  fetchFailure: (error: string) => ({ type: LEAVE_ACTIONS.FETCH_FAILURE, payload: error }),
  createRequest: (leaveData: any) => ({ type: LEAVE_ACTIONS.CREATE_REQUEST, payload: leaveData }),
  createSuccess: (leaveRequest: any) => ({ type: LEAVE_ACTIONS.CREATE_SUCCESS, payload: leaveRequest }),
  createFailure: (error: string) => ({ type: LEAVE_ACTIONS.CREATE_FAILURE, payload: error }),
  approveRequest: (id: string, approvalData: any) => ({ type: LEAVE_ACTIONS.APPROVE_REQUEST, payload: { id, data: approvalData } }),
  approveSuccess: (leaveRequest: any) => ({ type: LEAVE_ACTIONS.APPROVE_SUCCESS, payload: leaveRequest }),
  approveFailure: (error: string) => ({ type: LEAVE_ACTIONS.APPROVE_FAILURE, payload: error }),
  clearError: () => ({ type: LEAVE_ACTIONS.CLEAR_ERROR }),
};

function* fetchLeaveRequestsSaga(): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(leaveApi.getLeaveRequests);
    yield put(leaveActions.fetchSuccess(response));
  } catch (error: any) {
    yield put(leaveActions.fetchFailure(error.response?.data?.detail || 'Failed to fetch leave requests'));
  }
}

function* createLeaveRequestSaga(action: PayloadAction<any>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(leaveApi.createLeaveRequest, action.payload);
    yield put(leaveActions.createSuccess(response));
  } catch (error: any) {
    yield put(leaveActions.createFailure(error.response?.data?.detail || 'Failed to create leave request'));
  }
}

function* approveLeaveRequestSaga(action: PayloadAction<{ id: string; data: any }>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(leaveApi.approveLeaveRequest, action.payload.id, action.payload.data);
    yield put(leaveActions.approveSuccess(response));
  } catch (error: any) {
    yield put(leaveActions.approveFailure(error.response?.data?.detail || 'Failed to approve leave request'));
  }
}

export default function* leaveSaga() {
  yield takeEvery(LEAVE_ACTIONS.FETCH_REQUEST, fetchLeaveRequestsSaga);
  yield takeEvery(LEAVE_ACTIONS.CREATE_REQUEST, createLeaveRequestSaga);
  yield takeEvery(LEAVE_ACTIONS.APPROVE_REQUEST, approveLeaveRequestSaga);
}
