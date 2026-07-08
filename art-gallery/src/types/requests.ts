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



