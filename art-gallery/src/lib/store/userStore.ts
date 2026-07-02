import { User } from "@/lib/db/models";
import { connectDb } from "@/lib/db/db";
import { mapUserDocument } from "@/lib/mappers/user";
import { hashPassword } from "@/lib/auth/hashOrVerifyPasswordOrToken";
import type { IUser } from "@/types/lib";
import type { UserRole } from "@/types/db";
import { UserStoreError } from "@/errors/lib/userStoreErrors";

export async function findUserById(userId: string): Promise<IUser | null> {
  await connectDb();
  const user = await User.findOne({
    _id: userId,
  }).lean();
  return user ? mapUserDocument(user) : null;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  await connectDb();

  const user = await User.findOne({
    email,
  }).lean();

  return user ? mapUserDocument(user) : null;
}

export async function createUser(
  username: string,
  email: string,
  password: string,
  role?: UserRole,
): Promise<IUser> {
  try {
    await connectDb();

    const existing = await User.exists({
      email,
    });

    if (existing) {
      throw new UserStoreError("USER_ALREADY_EXISTS");
    }

    const user = await User.create({
      username,
      email,
      passwordHash: await hashPassword(password),
      role,
      createdAt: new Date(),
    });

    return mapUserDocument(user);
  } catch (err) {
    if (err instanceof UserStoreError) {
      throw err;
    }

    console.error("Failed to create user", err);
    throw new UserStoreError("INTERNAL_SERVER_ERROR");
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await connectDb();

    const result = await User.deleteOne({
      _id: userId,
    });

    if (result.deletedCount === 0) {
      throw new UserStoreError("USER_NOT_FOUND");
    }
  } catch (err) {
    if (err instanceof UserStoreError) {
      throw err;
    }

    console.error("Failed to delete user", err);
    throw new UserStoreError("INTERNAL_SERVER_ERROR");
  }
}
