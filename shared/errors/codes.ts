export const ErrorCodes = {
  BEAUTIFIER_MAX_RETRIES: 'BEAUTIFIER_MAX_RETRIES',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
