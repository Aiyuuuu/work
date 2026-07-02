import type { IUser as DbUser } from "@/types/db";
import type { IUser } from "@/types/lib";

export function mapUserDocument({
  _id,
  __v: _, 
  ...user
}: DbUser): IUser {
  return {
    id: _id.toString(),
    ...user,
  };
}