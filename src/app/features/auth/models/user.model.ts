export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  password?: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
