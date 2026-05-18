
import { COOKIES_REFRESH_COOKIE_MAX_AGE } from "@/constants/authConstants";
import { AuthError } from "@/lib/errors/authErrors";
import { hashPassword, verifyPassword } from "@/lib/auth/hashOrVerifyPassword";
import {
    createAccessTokenPayload,
    createRefreshTokenPayload,
    signAccessToken,
    signRefreshToken,
} from "@/lib/auth/signOrVerifyTokens";
import { storeRefreshToken } from "@/lib/auth/tokenStore";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import { ILoginServiceReturnPayload } from "@/types/auth/tokenAndUserSession";

export async function loginService(
    email: string,
    password: string
): Promise<ILoginServiceReturnPayload> {
    if (!email || !password) {
        throw new AuthError("MISSING_CREDENTIALS", "Missing credentials", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectDb();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials", 401);
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
        throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials", 401);
    }

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