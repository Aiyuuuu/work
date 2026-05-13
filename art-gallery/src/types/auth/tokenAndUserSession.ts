import type { userRole } from "@/types/userRole";
import type { JWTPayload } from "jose";

export type TokenType = "access" | "refresh";

export interface UserObject {
  email: string;
  role: userRole;
}

export interface TypeBaseTokenPayload extends JWTPayload  {
  email: string;
  role: userRole;
  type: TokenType;
};


export type TypeTokenPayload = TypeBaseTokenPayload;