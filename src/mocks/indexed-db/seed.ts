import { db } from './app.db';
import EmployeeDummyData from '../data/employees.json';
import UserDummyData from '../data/users.json';
import { Employee } from '../../app/features/employee/models/employee.model';
import { EmployeeStatus } from '../../app/features/employee/models/employee-status.model';
import { User } from '../../app/features/auth/models/user.model';

export async function seedEmployeesIfEmpty(): Promise<void> {
  const count = await db.employees.count();

  if (count === 0) {
    console.log('Seeding dummy employee into IndexedDB...');

    const employees: Employee[] = EmployeeDummyData.map((data) => ({
      ...data,
      status: data.status as EmployeeStatus,
    }));

    await db.employees.bulkAdd(employees);

    console.log('Dummy employee seeded successfully!');
  }
}

export async function seedUsersIfEmpty(): Promise<void> {
  const count = await db.users.count();

  if (count === 0) {
    console.log('Seeding dummy user into IndexedDB...');

    const users: User[] = UserDummyData;
    await db.users.bulkAdd(users);

    console.log('Dummy user seeded successfully!');
  }
}
