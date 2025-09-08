import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '../../services/api/notificationApi';

export const NOTIFICATION_ACTIONS = {
  FETCH_REQUEST: 'NOTIFICATION_FETCH_REQUEST',
  FETCH_SUCCESS: 'NOTIFICATION_FETCH_SUCCESS',
  FETCH_FAILURE: 'NOTIFICATION_FETCH_FAILURE',
  SEND_REQUEST: 'NOTIFICATION_SEND_REQUEST',
  SEND_SUCCESS: 'NOTIFICATION_SEND_SUCCESS',
  SEND_FAILURE: 'NOTIFICATION_SEND_FAILURE',
  MARK_READ_REQUEST: 'NOTIFICATION_MARK_READ_REQUEST',
  MARK_READ_SUCCESS: 'NOTIFICATION_MARK_READ_SUCCESS',
  MARK_READ_FAILURE: 'NOTIFICATION_MARK_READ_FAILURE',
  ADD: 'NOTIFICATION_ADD',
  CLEAR_ERROR: 'NOTIFICATION_CLEAR_ERROR',
};

export const notificationActions = {
  fetchRequest: () => ({ type: NOTIFICATION_ACTIONS.FETCH_REQUEST }),
  fetchSuccess: (notifications: any[]) => ({ type: NOTIFICATION_ACTIONS.FETCH_SUCCESS, payload: notifications }),
  fetchFailure: (error: string) => ({ type: NOTIFICATION_ACTIONS.FETCH_FAILURE, payload: error }),
  sendRequest: (notificationData: any) => ({ type: NOTIFICATION_ACTIONS.SEND_REQUEST, payload: notificationData }),
  sendSuccess: (notification: any) => ({ type: NOTIFICATION_ACTIONS.SEND_SUCCESS, payload: notification }),
  sendFailure: (error: string) => ({ type: NOTIFICATION_ACTIONS.SEND_FAILURE, payload: error }),
  markReadRequest: (id: string) => ({ type: NOTIFICATION_ACTIONS.MARK_READ_REQUEST, payload: id }),
  markReadSuccess: (id: string) => ({ type: NOTIFICATION_ACTIONS.MARK_READ_SUCCESS, payload: id }),
  markReadFailure: (error: string) => ({ type: NOTIFICATION_ACTIONS.MARK_READ_FAILURE, payload: error }),
  add: (notification: any) => ({ type: NOTIFICATION_ACTIONS.ADD, payload: notification }),
  clearError: () => ({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR }),
};

function* fetchNotificationsSaga(): Generator<CallEffect<any> | PutEffect<any>, void, any> {
  try {
    const response = yield call([notificationApi, 'getNotifications']);
    yield put(notificationActions.fetchSuccess(response));
  } catch (error: any) {
    yield put(notificationActions.fetchFailure(error.response?.data?.detail || 'Failed to fetch notifications'));
  }
}

function* sendNotificationSaga(action: PayloadAction<any>): Generator<CallEffect<any> | PutEffect<any>, void, any> {
  try {
    const response = yield call([notificationApi, 'createNotification'], action.payload);
    yield put(notificationActions.sendSuccess(response));
  } catch (error: any) {
    yield put(notificationActions.sendFailure(error.response?.data?.detail || 'Failed to send notification'));
  }
}

function* markNotificationReadSaga(action: PayloadAction<string>): Generator<CallEffect<any> | PutEffect<any>, void, any> {
  try {
    yield call([notificationApi, 'markAsRead'], action.payload);
    yield put(notificationActions.markReadSuccess(action.payload));
  } catch (error: any) {
    yield put(notificationActions.markReadFailure(error.response?.data?.detail || 'Failed to mark notification as read'));
  }
}

export default function* notificationSaga() {
  yield takeEvery(NOTIFICATION_ACTIONS.FETCH_REQUEST, fetchNotificationsSaga);
  yield takeEvery(NOTIFICATION_ACTIONS.SEND_REQUEST, sendNotificationSaga);
  yield takeEvery(NOTIFICATION_ACTIONS.MARK_READ_REQUEST, markNotificationReadSaga);
}
