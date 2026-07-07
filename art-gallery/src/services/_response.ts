// this file is a service utility to return standaridized service responses back to the caller
// this file is used by every service
import { ErrorCode, getDefaultMessage } from "@/errors/errors";
import {
  SuccessResponse,
  ErrorResponse,
} from "@/types/services";

export function successResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data: data,
  };
}

export function errorResponse(errorCode: ErrorCode): ErrorResponse<ErrorCode> {
  return {
    success: false,
    error: {
      code: errorCode,
      message: getDefaultMessage(errorCode),
    },
  };
}

// only compiles if the caller has checked '!response.success' first
export function isInternalServerError(
  response: ErrorResponse<ErrorCode>,
): boolean {
  return response.error.code === "INTERNAL_SERVER_ERROR";
}

// only compiles if the caller has checked 'response.success' first
export function getSuccessResponseData<T>(response: SuccessResponse<T>): T {
  return response.data;
}
