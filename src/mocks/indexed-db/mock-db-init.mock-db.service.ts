import { Injectable } from '@angular/core';
import { seedEmployeesIfEmpty, seedUsersIfEmpty } from './seed';

@Injectable({ providedIn: 'root' })
export class MockDbInitService {
  async init() {
    await Promise.all([seedUsersIfEmpty(), seedEmployeesIfEmpty()]);
  }
}
