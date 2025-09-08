export interface Employee {
    id?: number;  // optional because when adding a new employee, there’s no id yet
    name: string;
    email: string;
    designation: string;
}
