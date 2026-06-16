import type { userRole } from "@/types/userRole";
import type { JWTPayload } from "jose";
import { Types } from "mongoose";

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

export interface IAuthServiceReturnPayload {
  user: {
    username: string,
    email: string,
    role: userRole,
    createdAt: Date,
  },
  accessToken: string,
  refreshToken: string,
  refreshTokenId: Types.ObjectId
}

export type ILoginServiceReturnPayload = IAuthServiceReturnPayload;

export type ISignupServiceReturnPayload = IAuthServiceReturnPayload;

export interface IRefreshServiceReturnPayload {
  accessToken: string;
  refreshToken: string;
}

export interface ILogoutServiceReturnPayload {
  success: boolean;
}

