import type { UserObject} from "@/types/lib";
import type { IMedia as IMediaDb, IUser as IUserDb } from "@/types/db";
import { ErrorCode } from "@/errors/errors";


export interface ILoginServiceReturnPayload {
  userObject: UserObject;
  accessToken: string;
  refreshToken: string;
}

export interface ISignupServiceReturnPayload {
  userObject: UserObject;
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



/**
 * A standardized response wrapper for all service-level operations.
 * Uses a discriminated union so TypeScript can automatically type-check 
 * the 'data' or 'error' property depending on the 'success' flag.
 */
export type ServiceResponse<TData> =
  | {
      success: true;
      data: TData; // TData is dynamic and changes per service
    }
  | {
      success: false;
      error: {
        code: ErrorCode; // We will standardize these codes in the next step
        message: string;
      };
    };


export type ServiceSuccessResponse<T> = Extract<ServiceResponse<T>, { success: true }>;
export type ServiceErrorResponse<T> = Extract<ServiceResponse<T>, { success: false }>;