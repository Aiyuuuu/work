## Auth Error Codes

These are the standard error codes returned by auth API routes.

| Code | Meaning |
| --- | --- |
| MISSING_CREDENTIALS | Missing required fields (email/password/username). |
| INVALID_CREDENTIALS | Email or password is incorrect. |
| USER_EXISTS | A user with the same email/username already exists. |
| MISSING_REFRESH_TOKEN | No refresh token provided. |
| INVALID_REFRESH_TOKEN | Refresh token is invalid or expired. |
| MISSING_USER_ID | No user id was provided for logout. |
| MISSING_ACCESS_TOKEN | No access token provided. |
| INVALID_ACCESS_TOKEN | Access token is invalid or expired. |
| INVALID_USER | The user no longer exists. |
