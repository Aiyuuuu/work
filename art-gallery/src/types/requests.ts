import { UserRole } from "./db";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string; 
  password: string;
  role? : UserRole
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  userId: string;
  refreshTokenId?: string;
}
