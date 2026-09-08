/**
 * Central registry of all error codes shared between backend and frontend.
 *
 * Backend throws `AppError` with one of these codes.
 * Frontend maps these codes to localized error classes via `mapErrorCode()`.
 */
export const ErrorCodes = {
  /** AI provider failed to produce a valid response. */
  BEAUTIFIER_MALFORMED_RESPONSE: 'BEAUTIFIER_MALFORMED_RESPONSE',
  /** All AI providers exhausted their retries without producing a valid response. */
  BEAUTIFIER_MAX_RETRIES: 'BEAUTIFIER_MAX_RETRIES',
  /** AI provider returned a rate limit error (429). */
  BEAUTIFIER_RATE_LIMITED: 'BEAUTIFIER_RATE_LIMITED',
  /** An unexpected internal error that is not a known business error. */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/** Union type of all valid error code string literals. */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
