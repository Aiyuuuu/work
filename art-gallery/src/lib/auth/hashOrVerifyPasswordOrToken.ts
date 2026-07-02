import bcrypt from "bcryptjs";
import {SALT_ROUNDS} from "@/constants/authConstants"

// returns the hash of a password, salt rounds for increased security
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// compares password against a hash
export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, SALT_ROUNDS)
}

export function compareToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}
