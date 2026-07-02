import { Types } from "mongoose";

export type UserRole = "user" | "admin";

export function isUserRole(role: unknown): role is UserRole {
  return role === "user" || role === "admin";
}

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    __v: number
}

export interface ITag {
    _id: Types.ObjectId;
    externalId: number;
    name: string;
    __v: number
}

export interface IApi {
    _id: Types.ObjectId;
    name: string;
    baseUrl: string;
    __v: number
}
 
//IStats and IMeta are objects in media document
export interface IStats { //not a separate document in db
    cryCount: number;
    laughCount: number;
    likeCount: number;
    dislikeCount: number;
    heartCount: number;
    commentCount: number;
}

export interface IMeta { //not a separate document in db
    prompt?: string;
    negativePrompt?: string;
    seed?: number;
    sampler?: string;
    steps?: number;
    cfgScale?: number;
    clipSkip?: number;
}

export interface IMedia {
    _id: Types.ObjectId;
    externalId: number;
    url: string;
    hash: string;
    baseModel: string | null;
    browsingLevel: number;
    width: number;
    height: number;
    type: "image" | "video";
    createdAt: Date;
    username: string;
    stats: IStats;
    meta: IMeta | null;
    __v: number
}

export interface IRefreshToken {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
    __v: number
}