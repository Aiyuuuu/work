// this file is a API utility to return standaridized API responses back to the client
// this file is used by every API
import { ErrorCode, getDefaultMessage, getHttpStatus } from "@/errors/errors";
import type { SuccessResponse, ErrorResponse } from "@/types/api";
import { SUCCESS_STATUS } from "@/constants/apiConstants";

export function GETSuccessResponse<T>(data: T): SuccessResponse<T> {
  return [{ success: true, data: data }, { status: SUCCESS_STATUS.GET }];
} 

export function POSTSuccessResponse<T>(data: T): SuccessResponse<T> {
  return [{ success: true, data: data }, { status: SUCCESS_STATUS.POST}];
}

export function PUTSuccessResponse<T>(data: T): SuccessResponse<T> {
  return [{ success: true, data: data }, { status: SUCCESS_STATUS.PUT }];
}

export function PATCHSuccessResponse<T>(data: T): SuccessResponse<T> {
  return [{ success: true, data: data }, { status: SUCCESS_STATUS.PATCH }];
}

export function DELETESuccessResponse(): SuccessResponse<null> {
  return [null, { status: SUCCESS_STATUS.DELETE }];
}

export function errorResponse(errorCode: ErrorCode): ErrorResponse<ErrorCode> {
  return [
    {
      success: false,
      error: { 
        code: errorCode,
        message: getDefaultMessage(errorCode),
      },
    },
    { status: getHttpStatus(errorCode) },
  ];
}

// only compiles if the caller has checked 'response.success' first
export function getSuccessResponseData<T>(response: SuccessResponse<T>): T|null {
  return response[0]?.data ?? null;
}

export function getErrorResponseErrorCode(response: ErrorResponse<ErrorCode>): ErrorCode {
  return response[0].error.code
}

