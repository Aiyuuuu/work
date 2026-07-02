const USER_STORE_ERRORS = { 
  USER_NOT_FOUND: {
    message: "User not found",
  },
  USER_ALREADY_EXISTS: {
    message: "User already exists",
  },
  INTERNAL_SERVER_ERROR:{
    message: "Internal server error"
  } 
} as const; 

export type UserStoreErrorCode = keyof typeof USER_STORE_ERRORS;

export class UserStoreError extends Error {
  constructor(public readonly code: UserStoreErrorCode) {
    super(USER_STORE_ERRORS[code].message);
  }
}