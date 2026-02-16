export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
  };
}
