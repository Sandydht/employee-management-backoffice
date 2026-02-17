import { EmployeeSortField } from '../../app/features/employee/models/employee-sort-field.model';
import { Employee } from '../../app/features/employee/models/employee.model';

export const getEmployeeSortValue = (
  employee: Employee,
  field: EmployeeSortField,
): string | number => {
  switch (field) {
    case 'id':
      return employee.id;

    case 'username':
      return employee.username;

    case 'firstName':
      return employee.firstName;

    case 'lastName':
      return employee.lastName;

    case 'email':
      return employee.email;

    case 'birthDate':
      return employee.birthDate;

    case 'basicSalary':
      return employee.basicSalary;

    case 'status':
      return employee.status;

    case 'group':
      return employee.group;

    case 'description':
      return employee.description;

    case 'updatedAt':
      return employee.updatedAt ?? '';

    case 'createdAt':
    default:
      return new Date(employee.createdAt).getTime();
  }
};
