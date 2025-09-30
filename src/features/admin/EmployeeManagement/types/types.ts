export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  role: 'Team Lead' | 'HR' | 'Admin' | string; // Added role field
  joinDate: string;
  leaveDate?: string;
  supervisor: string;
  salary: number;
  workLocation: string;
  employmentType: string;
  temp_password?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  role: 'Team Lead' | 'HR' | 'Admin' | string; // Added role field
  joinDate: string;
  leaveDate?: string;
  employeeId: string;
  supervisor: string;
  salary: number;
  workLocation: string;
  employmentType: string;
}