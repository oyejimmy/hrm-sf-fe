import { call, put, takeEvery, takeLatest, CallEffect, PutEffect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api/authApi';
import { API_ENDPOINTS } from '../../constants/api';
import { tokenStorage, validateFormData } from '../../utils/security';

// Action Types
export const AUTH_ACTIONS = {
  LOGIN_REQUEST: 'AUTH_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
  SIGNUP_REQUEST: 'AUTH_SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'AUTH_SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'AUTH_SIGNUP_FAILURE',
  GET_USER_REQUEST: 'AUTH_GET_USER_REQUEST',
  GET_USER_SUCCESS: 'AUTH_GET_USER_SUCCESS',
  GET_USER_FAILURE: 'AUTH_GET_USER_FAILURE',
  REFRESH_REQUEST: 'AUTH_REFRESH_REQUEST',
  REFRESH_SUCCESS: 'AUTH_REFRESH_SUCCESS',
  REFRESH_FAILURE: 'AUTH_REFRESH_FAILURE',
  LOGOUT: 'AUTH_LOGOUT',
  CLEAR_ERROR: 'AUTH_CLEAR_ERROR',
};

// Action Creators
export const authActions = {
  loginRequest: (credentials: { email: string; password: string }) => ({
    type: AUTH_ACTIONS.LOGIN_REQUEST,
    payload: credentials,
  }),
  loginSuccess: (data: any) => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload: data,
  }),
  loginFailure: (error: string) => ({
    type: AUTH_ACTIONS.LOGIN_FAILURE,
    payload: error,
  }),
  signupRequest: (userData: any) => ({
    type: AUTH_ACTIONS.SIGNUP_REQUEST,
    payload: userData,
  }),
  signupSuccess: (data: any) => ({
    type: AUTH_ACTIONS.SIGNUP_SUCCESS,
    payload: data,
  }),
  signupFailure: (error: string) => ({
    type: AUTH_ACTIONS.SIGNUP_FAILURE,
    payload: error,
  }),
  getUserRequest: () => ({
    type: AUTH_ACTIONS.GET_USER_REQUEST,
  }),
  getUserSuccess: (user: any) => ({
    type: AUTH_ACTIONS.GET_USER_SUCCESS,
    payload: user,
  }),
  getUserFailure: (error: string) => ({
    type: AUTH_ACTIONS.GET_USER_FAILURE,
    payload: error,
  }),
  refreshRequest: () => ({
    type: AUTH_ACTIONS.REFRESH_REQUEST,
  }),
  refreshSuccess: (data: any) => ({
    type: AUTH_ACTIONS.REFRESH_SUCCESS,
    payload: data,
  }),
  refreshFailure: (error: string) => ({
    type: AUTH_ACTIONS.REFRESH_FAILURE,
    payload: error,
  }),
  logout: () => ({
    type: AUTH_ACTIONS.LOGOUT,
  }),
  clearError: () => ({
    type: AUTH_ACTIONS.CLEAR_ERROR,
  }),
};

// Sagas
function* loginSaga(action: PayloadAction<{ email: string; password: string }>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const sanitizedPayload: any = validateFormData(action.payload);
    const response = yield call({ context: authApi, fn: authApi.login }, sanitizedPayload);
    tokenStorage.setToken('access_token', response.access_token);
    tokenStorage.setToken('refresh_token', response.refresh_token);
    yield put(authActions.loginSuccess(response));
  } catch (error: any) {
    yield put(authActions.loginFailure(error.response?.data?.detail || 'Login failed'));
  }
}

function* signupSaga(action: PayloadAction<any>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const sanitizedPayload: any = validateFormData(action.payload);
    const response = yield call({ context: authApi, fn: authApi.signup }, sanitizedPayload);
    yield put(authActions.signupSuccess(response));
  } catch (error: any) {
    yield put(authActions.signupFailure(error.response?.data?.detail || 'Signup failed'));
  }
}

function* getUserSaga(): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call({ context: authApi, fn: authApi.getCurrentUser });
    yield put(authActions.getUserSuccess(response));
  } catch (error: any) {
    yield put(authActions.getUserFailure(error.response?.data?.detail || 'Failed to get user info'));
    // Clear tokens on failure
    tokenStorage.removeToken('access_token');
    tokenStorage.removeToken('refresh_token');
  }
}

function* refreshSaga(): Generator<CallEffect | PutEffect, void, any> {
  try {
    const refreshToken = tokenStorage.getToken('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = yield call({ context: authApi, fn: authApi.refreshToken }, refreshToken);
    tokenStorage.setToken('access_token', response.access_token);
    tokenStorage.setToken('refresh_token', response.refresh_token);
    yield put(authActions.refreshSuccess(response));
  } catch (error: any) {
    yield put(authActions.refreshFailure(error.response?.data?.detail || 'Token refresh failed'));
    // Clear tokens on failure
    tokenStorage.removeToken('access_token');
    tokenStorage.removeToken('refresh_token');
  }
}

function* logoutSaga(): Generator<CallEffect | PutEffect, void, any> {
  try {
    yield call({ context: authApi, fn: authApi.logout });
  } catch (error) {
    // Even if logout fails on server, clear storage
  } finally {
    tokenStorage.removeToken('access_token');
    tokenStorage.removeToken('refresh_token');
  }
}

// Watchers
export default function* authSaga() {
  yield takeLatest(AUTH_ACTIONS.LOGIN_REQUEST, loginSaga);
  yield takeLatest(AUTH_ACTIONS.SIGNUP_REQUEST, signupSaga);
  yield takeLatest(AUTH_ACTIONS.GET_USER_REQUEST, getUserSaga);
  yield takeLatest(AUTH_ACTIONS.REFRESH_REQUEST, refreshSaga);
  yield takeLatest(AUTH_ACTIONS.LOGOUT, logoutSaga);
}
