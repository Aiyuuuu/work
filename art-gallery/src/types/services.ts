import type { IMedia as IMediaDb, IUser as IUserDb } from "@/types/db";
import { ErrorCode } from "@/errors/errors";

/**
 * A standardized response wrapper for all service-level operations.
 */
// src/types/services/response.ts

export interface SuccessResponse<TData> {
  success: true;
  data: TData;
}

// We set a default generic parameter 'TErrorCode = ErrorCode'
// so we can simply write 'ErrorResponse' without passing a generic.
export interface ErrorResponse<TErrorCode = ErrorCode> {
  success: false;
  error: {
    code: TErrorCode;
    message: string;
  };
}

// Combined Union Type
export type ServiceResponse<TData, TErrorCode = ErrorCode> =
  | SuccessResponse<TData>
  | ErrorResponse<TErrorCode>;


export interface ILoginServiceReturnPayload {
  accessToken: string;
  refreshToken: string;
}

export interface ISignupServiceReturnPayload {
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshServiceReturnPayload {
  accessToken: string,
  refreshToken: string
}


export interface IUser extends Omit<IUserDb, "_id" | "__v"> {
  id: string;
}


export interface IMedia extends Omit<IMediaDb, "_id" | "__v"> {
  id: string;
  blurDataURL: string;
}

export interface IPaginatedMedia {
  items: IMedia[];
  startPage: number;
  pagesRequested: number;
  pagesReturned: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  nextStartPage: number | null;
}




