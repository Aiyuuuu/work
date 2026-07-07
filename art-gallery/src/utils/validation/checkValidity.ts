import { isValidObjectId } from "mongoose";


export function isValidMongooseObjectId(objectId: string): boolean{
    return isValidObjectId(objectId)
}