import { Types } from "mongoose";
import {userRole} from "@/types/userRole"

export interface Iusers {
    _id: Types.ObjectId;
    username: string,
    email: string,
    passwordHash: string,
    role: userRole,
    createdAt: Date,
}

export interface Itags {
    _id: Types.ObjectId,
    name: string
}

export interface Iapis {
    _id: Types.ObjectId,
    name: string,
    baseUrl: string
}

export interface Iimages {
    _id: Types.ObjectId,
    externalId: number,
    url: string,
    hash: string,
    baseModel: string,
    browsingLevel: number,
    width: number,
    height: number
}

export interface IrefreshTokens {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
    revoked: boolean, 
    createdAt: Date
}