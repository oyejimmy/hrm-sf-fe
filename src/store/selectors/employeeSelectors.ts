import { RootState } from '../index';

export const selectEmployee = (state: RootState) => state.employee;
export const selectEmployees = (state: RootState) => state.employee.employees;
export const selectCurrentEmployee = (state: RootState) => state.employee.currentEmployee;
export const selectEmployeeLoading = (state: RootState) => state.employee.isLoading;
export const selectEmployeeError = (state: RootState) => state.employee.error;

export const selectEmployeeById = (id: string) => (state: RootState) => 
  state.employee.employees.find(emp => emp.id === id);

export const selectEmployeesByDepartment = (department: string) => (state: RootState) =>
  state.employee.employees.filter(emp => emp.department === department);
