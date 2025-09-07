import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { employeeApi } from '../../services/api/employeeApi';

// Action Types
export const EMPLOYEE_ACTIONS = {
  FETCH_REQUEST: 'EMPLOYEE_FETCH_REQUEST',
  FETCH_SUCCESS: 'EMPLOYEE_FETCH_SUCCESS',
  FETCH_FAILURE: 'EMPLOYEE_FETCH_FAILURE',
  CREATE_REQUEST: 'EMPLOYEE_CREATE_REQUEST',
  CREATE_SUCCESS: 'EMPLOYEE_CREATE_SUCCESS',
  CREATE_FAILURE: 'EMPLOYEE_CREATE_FAILURE',
  UPDATE_REQUEST: 'EMPLOYEE_UPDATE_REQUEST',
  UPDATE_SUCCESS: 'EMPLOYEE_UPDATE_SUCCESS',
  UPDATE_FAILURE: 'EMPLOYEE_UPDATE_FAILURE',
  DELETE_REQUEST: 'EMPLOYEE_DELETE_REQUEST',
  DELETE_SUCCESS: 'EMPLOYEE_DELETE_SUCCESS',
  DELETE_FAILURE: 'EMPLOYEE_DELETE_FAILURE',
  SET_CURRENT: 'EMPLOYEE_SET_CURRENT',
  CLEAR_ERROR: 'EMPLOYEE_CLEAR_ERROR',
};

// Action Creators
export const employeeActions = {
  fetchRequest: () => ({ type: EMPLOYEE_ACTIONS.FETCH_REQUEST }),
  fetchSuccess: (employees: any[]) => ({ type: EMPLOYEE_ACTIONS.FETCH_SUCCESS, payload: employees }),
  fetchFailure: (error: string) => ({ type: EMPLOYEE_ACTIONS.FETCH_FAILURE, payload: error }),
  createRequest: (employeeData: any) => ({ type: EMPLOYEE_ACTIONS.CREATE_REQUEST, payload: employeeData }),
  createSuccess: (employee: any) => ({ type: EMPLOYEE_ACTIONS.CREATE_SUCCESS, payload: employee }),
  createFailure: (error: string) => ({ type: EMPLOYEE_ACTIONS.CREATE_FAILURE, payload: error }),
  updateRequest: (id: string, employeeData: any) => ({ type: EMPLOYEE_ACTIONS.UPDATE_REQUEST, payload: { id, data: employeeData } }),
  updateSuccess: (employee: any) => ({ type: EMPLOYEE_ACTIONS.UPDATE_SUCCESS, payload: employee }),
  updateFailure: (error: string) => ({ type: EMPLOYEE_ACTIONS.UPDATE_FAILURE, payload: error }),
  deleteRequest: (id: string) => ({ type: EMPLOYEE_ACTIONS.DELETE_REQUEST, payload: id }),
  deleteSuccess: (id: string) => ({ type: EMPLOYEE_ACTIONS.DELETE_SUCCESS, payload: id }),
  deleteFailure: (error: string) => ({ type: EMPLOYEE_ACTIONS.DELETE_FAILURE, payload: error }),
  setCurrent: (employee: any) => ({ type: EMPLOYEE_ACTIONS.SET_CURRENT, payload: employee }),
  clearError: () => ({ type: EMPLOYEE_ACTIONS.CLEAR_ERROR }),
};

// Sagas
function* fetchEmployeesSaga(): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(employeeApi.getEmployees);
    yield put(employeeActions.fetchSuccess(response));
  } catch (error: any) {
    yield put(employeeActions.fetchFailure(error.response?.data?.detail || 'Failed to fetch employees'));
  }
}

function* createEmployeeSaga(action: PayloadAction<any>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(employeeApi.createEmployee, action.payload);
    yield put(employeeActions.createSuccess(response));
  } catch (error: any) {
    yield put(employeeActions.createFailure(error.response?.data?.detail || 'Failed to create employee'));
  }
}

function* updateEmployeeSaga(action: PayloadAction<{ id: string; data: any }>): Generator<CallEffect | PutEffect, void, any> {
  try {
    const response = yield call(employeeApi.updateEmployee, action.payload.id, action.payload.data);
    yield put(employeeActions.updateSuccess(response));
  } catch (error: any) {
    yield put(employeeActions.updateFailure(error.response?.data?.detail || 'Failed to update employee'));
  }
}

function* deleteEmployeeSaga(action: PayloadAction<string>): Generator<CallEffect | PutEffect, void, any> {
  try {
    yield call(employeeApi.deleteEmployee, action.payload);
    yield put(employeeActions.deleteSuccess(action.payload));
  } catch (error: any) {
    yield put(employeeActions.deleteFailure(error.response?.data?.detail || 'Failed to delete employee'));
  }
}

// Watchers
export default function* employeeSaga() {
  yield takeEvery(EMPLOYEE_ACTIONS.FETCH_REQUEST, fetchEmployeesSaga);
  yield takeEvery(EMPLOYEE_ACTIONS.CREATE_REQUEST, createEmployeeSaga);
  yield takeEvery(EMPLOYEE_ACTIONS.UPDATE_REQUEST, updateEmployeeSaga);
  yield takeEvery(EMPLOYEE_ACTIONS.DELETE_REQUEST, deleteEmployeeSaga);
}
