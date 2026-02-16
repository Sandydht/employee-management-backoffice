import { http, HttpResponse } from 'msw';
import UsersDummyData from '../data/users.json';
import EmployeesDummyData from '../data/employees.json';
import { PaginationQuery } from '../../app/shared/models/pagination-query.model';
import { SortOrder } from '../../app/shared/models/sort-order.model';
import { paginateArray } from '../utils/paginateArray';
import { decrypt } from '../utils/cryptoJs';
import { Employee } from '../../app/features/employee/models/employee.model';

export const employeeHandlers = [
  http.get('/api/employee/list', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = UsersDummyData.find((user) => user.id === decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);

    const page = url.searchParams.get('page') ?? 1;
    const size = url.searchParams.get('size') ?? 10;
    const sortBy = url.searchParams.get('sortBy') ?? 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc';
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    let employees: Employee[] = [...EmployeesDummyData] as unknown as Employee[];
    employees = employees.filter((data) => data.deletedAt === null);

    if (search) {
      employees = employees.filter((data) => {
        const username = data.username.toLowerCase() ?? '';
        const firstName = data.firstName.toLowerCase() ?? '';
        const email = data.email.toLowerCase() ?? '';

        return username.includes(search) || firstName.includes(search) || email.includes(search);
      });
    }

    employees.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;

        case 'username':
          aValue = a.username;
          bValue = b.username;
          break;

        case 'firstName':
          aValue = a.firstName;
          bValue = b.firstName;
          break;

        case 'lastName':
          aValue = a.lastName;
          bValue = b.lastName;
          break;

        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;

        case 'birthDate':
          aValue = a.birthDate;
          bValue = b.birthDate;
          break;

        case 'basicSalary':
          aValue = a.basicSalary;
          bValue = b.basicSalary;
          break;

        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;

        case 'group':
          aValue = a.group;
          bValue = b.group;
          break;

        case 'description':
          aValue = a.description;
          bValue = b.description;
          break;

        case 'updatedAt':
          aValue = a.updatedAt || '';
          bValue = b.updatedAt || '';
          break;

        case 'deletedAt':
          aValue = a.deletedAt || '';
          bValue = b.deletedAt || '';
          break;

        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

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
    const user = UsersDummyData.find((user) => user.id === decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const employee: Employee | null = EmployeesDummyData.find((data) => data.id === id) as Employee;
    if (!employee) {
      return HttpResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return HttpResponse.json(employee, { status: 200 });
  }),
];
