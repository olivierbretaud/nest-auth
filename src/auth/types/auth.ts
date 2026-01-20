export interface UserAuth {
  id: string;
  email: string;
  role: string;
}

export interface UserJWTPayload {
  sub: string;
  email: string;
  role: string;
}