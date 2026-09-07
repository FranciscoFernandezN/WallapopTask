import type { ErrorCode } from '../../../shared/errors/codes.ts';

export class AppError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}
