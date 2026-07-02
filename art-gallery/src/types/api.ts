import { UserObject } from "./lib";


export interface IAuthServiceReturnPayload {
  user: UserObject
  accessToken: string,
  refreshToken: string,
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

