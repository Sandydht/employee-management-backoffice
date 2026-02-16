import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth.handler';
import { employeeHandlers } from './handlers/employee.handler';

export const worker = setupWorker(...authHandlers, ...employeeHandlers);
