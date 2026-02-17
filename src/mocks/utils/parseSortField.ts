import { EmployeeSortField } from '../../app/features/employee/models/employee-sort-field.model';

export const parseSortField = (value: string | null): EmployeeSortField => {
  const allowedFields: EmployeeSortField[] = [
    'id',
    'username',
    'firstName',
    'lastName',
    'email',
    'birthDate',
    'basicSalary',
    'status',
    'group',
    'description',
    'createdAt',
    'updatedAt',
  ];

  if (allowedFields.includes(value as EmployeeSortField)) {
    return value as EmployeeSortField;
  }

  return 'createdAt';
};
