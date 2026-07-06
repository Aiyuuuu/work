// this file is a service utility to return standaridized service responses back to the caller
// this file is used by every service
import { ErrorCode, getDefaultMessage } from "@/errors/errors";
import { ServiceResponse, ServiceSuccessResponse } from "@/types/services";

export function successResponse<T>(data: T): ServiceResponse<T>{
 return {
      success: true,
      data: data
    }
}

export function errorResponse(errorCode: ErrorCode): ServiceResponse<never>{
    return {
      success: false,
      error: {
        code: errorCode,
        message: getDefaultMessage(errorCode),
      }
    }
}

// <never> ensures this function is only called for error responses and not for success responses (compile time)
export function isInternalServerError(response: ServiceResponse<never>): boolean{
    return !response.success && response.error.code === "INTERNAL_SERVER_ERROR";
}

