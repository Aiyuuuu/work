import { User } from "@/lib/db/models";
import { connectDb } from "@/lib/db/db";
import { mapUserDocument } from "@/mappers/user";
import { hashPassword } from "@/lib/auth/hashOrVerifyPasswordOrToken";
import type { IUser } from "@/types/services";
import type { UserRole } from "@/types/db";
import { ServiceResponse } from "@/types/services";
import { successResponse, errorResponse } from "./_response";

export async function findUserById(
  userId: string,
): Promise<ServiceResponse<IUser>> {
  if (!userId) {
    return errorResponse("INVALID_CREDENTIALS");
  }

  try {
    await connectDb();
    const user = await User.findOne({
      _id: userId,
    }).lean();
    return user
      ? successResponse(mapUserDocument(user))
      : errorResponse("USER_NOT_FOUND");
  } catch (err) {
    console.error("Failed to find user by id", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function findUserByEmail(
  email: string,
): Promise<ServiceResponse<IUser>> {
  if (!email) {
    return errorResponse("INVALID_CREDENTIALS");
  }
  try {
    await connectDb();
    const user = await User.findOne({
      email,
    }).lean();
    return user
      ? successResponse(mapUserDocument(user))
      : errorResponse("USER_NOT_FOUND");
  } catch (err) {
    console.error("Failed to find user by email", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string,
  role?: UserRole,
): Promise<ServiceResponse<IUser>> {
  if (!username || !email || !password) {
    return errorResponse("INVALID_CREDENTIALS");
  }

  try {
    await connectDb();

    const existing = await User.exists({
      email,
    });

    if (existing) {
      return errorResponse("USER_ALREADY_EXISTS");
    }

    const user = await User.create({
      username,
      email,
      passwordHash: await hashPassword(password),
      role,
      createdAt: new Date(),
    });

    return successResponse(mapUserDocument(user));
  } catch (err) {
    console.error("Failed to create user", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}

export async function deleteUser(
  userId: string,
): Promise<ServiceResponse<null>> {
  if (!userId) {
    return errorResponse("INVALID_CREDENTIALS");
  }

  try {
    await connectDb();

    const existing = await User.exists({
      _id: userId,
    });

    if (!existing) {
      return errorResponse("USER_NOT_FOUND");
    }

    await User.deleteOne({
      _id: userId,
    });

    return successResponse(null);
  } catch (err) {
    console.error("Failed to delete user", err);
    return errorResponse("INTERNAL_SERVER_ERROR");
  }
}
