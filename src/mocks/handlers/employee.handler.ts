import { http, HttpResponse } from 'msw';
import { PaginationQuery } from '../../app/shared/models/pagination-query.model';
import { SortOrder } from '../../app/shared/models/sort-order.model';
import { paginateArray } from '../utils/paginateArray';
import { decrypt } from '../utils/cryptoJs';
import { Employee } from '../../app/features/employee/models/employee.model';
import { AddUpdateEmployeeRequest } from '../../app/features/employee/models/add-employee-request.model';
import { v4 as uuid } from 'uuid';
import { EmployeeStatus } from '../../app/features/employee/models/employee-status.model';
import { db } from '../indexed-db/app.db';
import { getEmployeeSortValue } from '../utils/getEmployeeSortValue';
import { parseSortField } from '../utils/parseSortField';
import { parseSortOrder } from '../utils/parseSortOrder';
import { ToTitleCasePipe } from '../../app/shared/pipes/to-title-case-pipe/to-title-case-pipe';
import { ToSnakeCasePipe } from '../../app/shared/pipes/to-snake-case-pipe/to-snake-case-pipe';

const toTitleCase = new ToTitleCasePipe();
const toSnakeCase = new ToSnakeCasePipe();

export const employeeHandlers = [
  http.get('/api/employee/list', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);
    const sortBy = parseSortField(url.searchParams.get('sortBy'));
    const sortOrder = parseSortOrder(url.searchParams.get('sortOrder'));
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    let collection = db.employees.filter((emp) => emp.deletedAt === null);

    if (search) {
      collection = collection.filter((emp) => {
        return (
          emp.username.toLowerCase().includes(search) ||
          emp.firstName.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search)
        );
      });
    }

    let employees = await collection.toArray();

    employees = employees.map((data) => ({
      ...data,
      group: toTitleCase.transform(data.group),
    }));

    employees.sort((a, b) => {
      const aValue = getEmployeeSortValue(a, sortBy);
      const bValue = getEmployeeSortValue(b, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const query: PaginationQuery = {
      page: Number(page),
      size: Number(size),
      search,
      sortBy,
      sortOrder: sortOrder as SortOrder,
    };
    const result = paginateArray<Employee>(employees, query);

    return HttpResponse.json(result, { status: 200 });
  }),

  http.get('/api/employee/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const employee: Employee | undefined = await db.employees.where('id').equals(id).first();
    if (!employee) {
      return HttpResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return HttpResponse.json(
      {
        ...employee,
        group: toSnakeCase.transform(employee.group),
      },
      { status: 200 },
    );
  }),

  http.post('/api/employee/add', async ({ request }) => {
    const body = (await request.json()) as AddUpdateEmployeeRequest;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const [findEmployeeByUsername, findEmployeeByEmail] = await Promise.all([
      db.employees.where('username').equals(body.username).first(),
      db.employees.where('email').equals(body.email).first(),
    ]);

    if (findEmployeeByUsername) {
      return HttpResponse.json({ message: 'Username already exist' }, { status: 400 });
    }

    if (findEmployeeByEmail) {
      return HttpResponse.json({ message: 'Email already exist' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const birthDate = new Date(body.birthDate).toISOString();
    const newEmployeeData: Employee = {
      ...body,
      id: uuid(),
      birthDate,
      status: body.status as EmployeeStatus,
      createdAt: now,
      updatedAt: null,
      deletedAt: null,
    };

    await db.employees.add(newEmployeeData);
    return HttpResponse.json(newEmployeeData, { status: 201 });
  }),

  http.delete('/api/employee/:id/delete', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const employee: Employee | undefined = await db.employees.where('id').equals(id).first();
    if (!employee) {
      return HttpResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updatedBody: Partial<Employee> = {
      ...employee,
      status: employee.status as EmployeeStatus,
      deletedAt: now,
    };
    await db.employees.update(String(id), updatedBody);
    return HttpResponse.json(employee, { status: 200 });
  }),

  http.patch('/api/employee/:id/edit', async ({ params, request }) => {
    const body = (await request.json()) as AddUpdateEmployeeRequest;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const employee: Employee | undefined = await db.employees.where('id').equals(id).first();
    if (!employee) {
      return HttpResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updatedBody: Partial<Employee> = {
      ...body,
      status: body.status as EmployeeStatus,
      updatedAt: now,
    };

    await db.employees.update(String(id), updatedBody);

    return HttpResponse.json(
      {
        ...employee,
        group: toSnakeCase.transform(employee.group),
      },
      { status: 200 },
    );
  }),
];
