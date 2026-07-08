// this file is a API utility to return standaridized API responses back to the client
// this file is used by every API
import { ErrorCode, getDefaultMessage, getHttpStatus } from "@/errors/errors";
import type { SuccessResponse, ErrorResponse } from "@/types/api";
import { SUCCESS_STATUS } from "@/constants/apiConstants";
import { getSuccessResponseData as getServiceSuccessResponseData, isInternalServerError as isServiceInternalServerError, getErrorResponseErrorCode as getServiceErrorResponseErrorCode} from "@/services/_response";

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

export {getServiceSuccessResponseData, isServiceInternalServerError, getServiceErrorResponseErrorCode}