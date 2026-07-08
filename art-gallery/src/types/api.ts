import { ErrorCode } from "@/errors/errors";

/**
 * A standardized response wrapper for all api-level operations.
 */

// 1. Success Tuple [ Body, { status } ]
export type SuccessResponse<TData> = [
  null | {
    success: true;
    data: TData | null; // data field remains nullable
  },
  {
    status: number;
  }
];

// 2. Error Tuple [ Body, { status } ]
export type ErrorResponse<TErrorCode = ErrorCode> = [
  {
    success: false;
    error: {
      code: TErrorCode;
      message: string;
    };
  },
  {
    status: number;
  },
];

// 3. Combined API Response Union
export type ApiResponse<TData, TErrorCode = ErrorCode> =
  | SuccessResponse<TData>
  | ErrorResponse<TErrorCode>;
