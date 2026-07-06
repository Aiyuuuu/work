import type { IUser } from "@/types/db";

export function mapUserDocument({
  _id,
  __v: _, 
  ...user
}: IUser) {
  return {
    id: _id.toString(),
    ...user,
  };
}