import Dexie, { Table } from 'dexie';
import { Employee } from '../../app/features/employee/models/employee.model';
import { User } from '../../app/features/auth/models/user.model';

export class MockAppDB extends Dexie {
  employees!: Table<Employee, string>;
  users!: Table<User, string>;

  constructor() {
    super('MockEmployeeDB');

    this.version(1).stores({
      users: 'id, username',
      employees: 'id, username, email',
    });
  }
}

export const db = new MockAppDB();
