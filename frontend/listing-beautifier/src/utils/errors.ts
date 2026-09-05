import i18next from 'i18next';

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
