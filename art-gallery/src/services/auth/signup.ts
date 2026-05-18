import { COOKIES_REFRESH_COOKIE_MAX_AGE } from "@/constants/authConstants";
import { AuthError } from "@/lib/errors/authErrors";
import { hashPassword } from "@/lib/auth/hashOrVerifyPassword";
import {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/signOrVerifyTokens";
import { storeRefreshToken } from "@/lib/auth/tokenStore";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import { ISignupServiceReturnPayload } from "@/types/auth/tokenAndUserSession";

export async function signupService(
  username: string,
  email: string,
  password: string
): Promise<ISignupServiceReturnPayload> {
  if (!username || !email || !password) {
    throw new AuthError("MISSING_CREDENTIALS", "Missing credentials", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  await connectDb();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existing) {
    throw new AuthError("USER_EXISTS", "User already exists", 409);
  }

  const passwordHash = await hashPassword(password);
  const createdAt = new Date();

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    role: "user",
    createdAt,
  });

  const accessPayload = createAccessTokenPayload(user.email, user.role);
  const refreshPayload = createRefreshTokenPayload(user.email, user.role);

  const accessToken = await signAccessToken(accessPayload);
  const refreshToken = await signRefreshToken(refreshPayload);

  const refreshTokenHash = await hashPassword(refreshToken);
  const expiresAt = new Date(Date.now() + COOKIES_REFRESH_COOKIE_MAX_AGE * 1000);
  const refreshTokenId = await storeRefreshToken(
    user._id,
    refreshTokenHash,
    expiresAt
  );

  return {
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
    refreshTokenId,
  };
}
