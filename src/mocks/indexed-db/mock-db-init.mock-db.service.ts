import { Injectable } from '@angular/core';
import { seedEmployeesIfEmpty, seedUsersIfEmpty } from './seed';

@Injectable({ providedIn: 'root' })
export class MockDbInitService {
  init() {
    return Promise.all([seedUsersIfEmpty(), seedEmployeesIfEmpty()]);
  }
}
