import { EmployeeStatus } from './employee-status.model';

export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: EmployeeStatus;
  group: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
