import i18next from 'i18next';
import { ErrorCodes } from '../../../../shared/errors/codes.ts';

/**
 * Error thrown when the backend responds with a `deprecation-date` header,
 * indicating the API version will be retired by the given date.
 *
 * @param deprecationDate - The date after which the API will no longer function.
 */
export class DeprecationError extends Error {
  constructor(deprecationDate: Date) {
    const formattedDate = deprecationDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    super(i18next.t('errors.deprecation', { deprecation_date: formattedDate }));
    this.name = 'DeprecationError';
  }
}

/**
 * Base class for errors returned by the backend API.
 *
 * Carries the machine-readable error code so components can
 * branch on `instanceof` subclasses for specific handling.
 *
 * @param code - The error code string from the backend response body.
 */
export class BackendError extends Error {
  public readonly code: string;

  constructor(code: string) {
    super();
    this.code = code;
    this.name = 'BackendError';
  }
}

/**
 * Error thrown when the beautifier exhausts all retries across all providers.
 *
 * Displays a localized message to the user via the error popup.
 */
export class BeautifierError extends BackendError {
  constructor() {
    super(ErrorCodes.BEAUTIFIER_MAX_RETRIES);
    this.message = i18next.t('errors.beautifier');
    this.name = 'BeautifierError';
  }
}

/**
 * Error thrown for unexpected backend failures not covered by specific error codes.
 *
 * Displays a generic localized message to the user.
 */
export class InternalError extends BackendError {
  constructor() {
    super(ErrorCodes.INTERNAL_ERROR);
    this.message = i18next.t('errors.internal');
    this.name = 'InternalError';
  }
}

/**
 * Maps a backend error code string to the corresponding localized `BackendError` subclass.
 *
 * Unknown codes fall back to the base `BackendError` class.
 *
 * @param code - The error code from the backend JSON response.
 * @returns An instance of the appropriate `BackendError` subclass with a localized message.
 */
export function mapErrorCode(code: string): BackendError {
  switch (code) {
    case ErrorCodes.BEAUTIFIER_MAX_RETRIES:
      return new BeautifierError();
    case ErrorCodes.INTERNAL_ERROR:
      return new InternalError();
    default:
      return new BackendError(code);
  }
}
