import { http, HttpResponse } from 'msw';
import { decrypt } from '../utils/cryptoJs';
import { db } from '../indexed-db/app.db';
import { Employee } from '../../app/features/employee/models/employee.model';
import { ToTitleCasePipe } from '../../app/shared/pipes/to-title-case-pipe/to-title-case-pipe';

const toTitleCase = new ToTitleCasePipe();

export const dashboardHandlers = [
  http.get('/api/dashboard/total-employees', async ({ request }) => {
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

    const totalEmployees = await db.employees.filter((data) => data.deletedAt === null).count();
    const activeEmployees = await db.employees
      .filter((data) => data.deletedAt === null && data.status === 'ACTIVE')
      .count();
    const inactiveEmployees = await db.employees
      .filter((data) => data.deletedAt === null && data.status === 'INACTIVE')
      .count();

    return HttpResponse.json(
      {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
      },
      { status: 200 },
    );
  }),

  http.get('/api/dashboard/employee-list', async ({ request }) => {
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
    const recent = url.searchParams.get('recent') === 'true';

    let employees: Employee[] = await db.employees
      .filter((data) => data.deletedAt === null)
      .toArray();

    if (recent) {
      employees = employees.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
    }

    employees = employees.map((data) => ({
      ...data,
      group: toTitleCase.transform(data.group),
    }));
    return HttpResponse.json(employees, { status: 200 });
  }),
];
