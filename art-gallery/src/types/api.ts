import { UserRole } from "@/types/db";


export interface IAuthServiceReturnPayload {
  user: {
    username: string,
    email: string,
    role: UserRole,
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

