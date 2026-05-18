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

export interface IImage {
    _id: Types.ObjectId,
    externalId: number,
    url: string,
    hash: string,
    baseModel: string,
    browsingLevel: number,
    width: number,
    height: number
}

export interface IRefreshToken {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    tokenHash: string,
    expiresAt: Date,
    revoked: boolean, 
    createdAt: Date
}