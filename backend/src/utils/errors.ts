import type { ErrorCode } from '../../../shared/errors/codes.ts';

/**
 * Application-level error with a typed error code.
 *
 * Thrown by backend services and caught by the controller,
 * which serializes the code and message into the HTTP response.
 *
 * @param code - Machine-readable error code from `shared/errors/codes.ts`.
 * @param message - Human-readable description of what went wrong.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}
