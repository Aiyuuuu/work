import type { UserObject, IMedia as IMediaLib, PaginatedMediaResult as PaginatedMediaResultLib} from "@/types/lib";

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



export interface IMedia extends IMediaLib {
  blurDataURL: string | null;
}

export type PaginatedMediaResult = Omit<PaginatedMediaResultLib, "items"> & {
  items: IMedia[];
}


