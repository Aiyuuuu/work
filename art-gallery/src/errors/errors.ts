import { ERRORS } from "@/constants/errorConstants";

// 1. AUTOMATICALLY DERIVE THE ErrorCode TYPE
// This evaluates exactly to: "MISSING_CREDENTIALS" | "INVALID_CREDENTIALS" | "ACCESS_TOKEN_EXPIRED" | ...
export type ErrorCode = keyof typeof ERRORS;

// 2. HELPER UTILITY: Get HTTP Status Code from an ErrorCode
export function getHttpStatus(code: ErrorCode): number {
  return ERRORS[code]?.status;
}

// 3. HELPER UTILITY: Get Default Message from an ErrorCode
export function getDefaultMessage(code: ErrorCode): string {
  return ERRORS[code]?.message;
}

