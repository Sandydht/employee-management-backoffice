import { http, HttpResponse } from 'msw';
import UsersDummyData from '../data/users.json';
import { LoginRequest } from '../../app/features/auth/models/login-request.model';
import { LoginResponse } from '../../app/features/auth/models/login-response.model';
import { encrypt } from '../utils/cryptoJs';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    const user = UsersDummyData.find(
      (user) => user.username === body.username && user.password === body.password,
    );

    if (!user) {
      return HttpResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const encryptedUserId = encrypt(user.id);
    const data: LoginResponse = {
      token: encryptedUserId,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };

    return HttpResponse.json({ ...data }, { status: 200 });
  }),
];
