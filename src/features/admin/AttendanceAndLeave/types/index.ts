export interface Attendance {
  id?: number;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  hoursWorked?: number;
  remarks?: string;
}

export interface LeaveRequest {
  id?: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}