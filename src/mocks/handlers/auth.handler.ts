import { http, HttpResponse } from 'msw';
import { LoginRequest } from '../../app/features/auth/models/login-request.model';
import { LoginResponse } from '../../app/features/auth/models/login-response.model';
import { decrypt, encrypt } from '../utils/cryptoJs';
import { db } from '../indexed-db/app.db';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    const user = await db.users.where('username').equals(body.username).first();
    if (!user || user.password !== body.password) {
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

  http.get('/api/auth/profile', async ({ request }) => {
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

    return HttpResponse.json(user, { status: 200 });
  }),
];
