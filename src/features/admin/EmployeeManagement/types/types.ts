export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  joinDate: string;
  leaveDate?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'on_leave' | 'inactive';
  joinDate: string;
  leaveDate?: string;
}