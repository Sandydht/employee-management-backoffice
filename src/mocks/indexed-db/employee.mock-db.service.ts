import { Injectable } from '@angular/core';
import { db } from './app.db';
import { Employee } from '../../app/features/employee/models/employee.model';
import { seedEmployeesIfEmpty } from './seed';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class EmployeeMockDbService {
  async init(): Promise<void> {
    await seedEmployeesIfEmpty();
  }

  async getAll(): Promise<Employee[]> {
    return await db.employees.toArray();
  }

  async getById(id: string): Promise<Employee | undefined> {
    return await db.employees.get(id);
  }

  async create(payload: Omit<Employee, 'id'>): Promise<Employee> {
    const newEmployee: Employee = {
      id: uuid(),
      ...payload,
    };

    await db.employees.add(newEmployee);

    return newEmployee;
  }

  async update(id: string, payload: Partial<Employee>): Promise<void> {
    await db.employees.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await db.employees.delete(id);
  }

  async clear(): Promise<void> {
    await db.employees.clear();
  }
}
