import type { IRefreshToken } from "@/types/db";

export function mapRefreshTokenDocument({
  _id,
  __v,
  ...refreshToken
}: IRefreshToken) {
  const plainRefreshToken = JSON.parse(JSON.stringify(refreshToken));
  return {
    id: _id.toString(),
    ...plainRefreshToken,
  };
}
