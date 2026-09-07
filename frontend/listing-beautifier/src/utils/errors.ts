import i18next from 'i18next';
import { ErrorCodes } from '../../../../shared/errors/codes.ts';

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

export class BackendError extends Error {
  public readonly code: string;

  constructor(code: string) {
    super();
    this.code = code;
    this.name = 'BackendError';
  }
}

export class BeautifierError extends BackendError {
  constructor() {
    super(ErrorCodes.BEAUTIFIER_MAX_RETRIES);
    this.message = i18next.t('errors.beautifier');
    this.name = 'BeautifierError';
  }
}

export class InternalError extends BackendError {
  constructor() {
    super(ErrorCodes.INTERNAL_ERROR);
    this.message = i18next.t('errors.internal');
    this.name = 'InternalError';
  }
}

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
