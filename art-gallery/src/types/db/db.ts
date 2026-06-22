import { Types } from "mongoose";
import {userRole} from "@/types/userRole"

export interface IUser {
    _id: Types.ObjectId;
    username: string,
    email: string,
    passwordHash: string,
    role: userRole,
    createdAt: Date,
}

export interface ITag {
    _id: Types.ObjectId,
    name: string
}

export interface IApi {
    _id: Types.ObjectId,
    name: string,
    baseUrl: string
}


export interface IStats {
    cryCount: number,
    laughCount: number,
    likeCount: number,
    dislikeCount: number,
    heartCount: number,
    commentCount: number,
}

export interface IMeta {
    prompt?: string,
    seed?: number,
    sampler?: string,
    steps?: number,
}

export interface IImage {
    _id: Types.ObjectId,
    externalId: number,
    url: string,
    hash: string,
    baseModel: string,
    browsingLevel: number,
    width: number,
    height: number,
    type: string,
    createdAt: Date | null,
    username: string,
    stats: IStats,
    meta: IMeta | null
}


export interface IRefreshToken {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
    revoked: boolean, 
    createdAt: Date
}