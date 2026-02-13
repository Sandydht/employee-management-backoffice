import { http, HttpResponse } from 'msw';
import users from '../data/users.json';
import { LoginRequest } from '../../app/features/auth/models/login-request.model';
import { LoginResponse } from '../../app/features/auth/models/login-response.model';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    const user = users.find((u) => u.username === body.username && u.password === body.password);

    if (!user) {
      return HttpResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const data: LoginResponse = {
      token: 'dummy-jwt-token-123',
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
      },
    };

    return HttpResponse.json({ ...data }, { status: 200 });
  }),
];
