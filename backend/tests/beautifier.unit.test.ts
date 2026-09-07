import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { parseListingResponse, titleContainsMinWords, beautifySellerDetails } from '../src/services/beautifier.service.ts';
import { AppError } from '../src/utils/errors.ts';
import { ErrorCodes } from '../../shared/errors/codes.ts';

describe('parseListingResponse', () => {
  test('throws AppError when response has fewer than 3 lines', () => {
    const invalidResponse = 'Title only\nOne tag';

    expect(() => parseListingResponse(invalidResponse)).toThrow(AppError);
    expect(() => parseListingResponse(invalidResponse)).toThrow('Invalid response format: expected at least 3 lines');
  });

  test('throws AppError when price range format is invalid', () => {
    const invalidPriceResponse = 'Some Title\ntag1, tag2\nnot-a-price-range';

    expect(() => parseListingResponse(invalidPriceResponse)).toThrow(AppError);
    expect(() => parseListingResponse(invalidPriceResponse)).toThrow('Invalid price range format');
  });

  test('throws AppError with BEAUTIFIER_MAX_RETRIES code', () => {
    const invalidResponse = 'Only title';

    expect(() => parseListingResponse(invalidResponse)).toThrow(AppError);

    try {
      parseListingResponse(invalidResponse);
    } catch (error) {
      expect((error as AppError).code).toBe(ErrorCodes.BEAUTIFIER_MAX_RETRIES);
    }
  });

  test('parses valid response correctly', () => {
    const validResponse = 'Vintage Leather Jacket\nvintage, leather, jacket\n25-50';

    const result = parseListingResponse(validResponse);

    expect(result.title).toBe('Vintage Leather Jacket');
    expect(result.tags).toEqual(['vintage', 'leather', 'jacket']);
    expect(result.priceRange).toEqual([25, 50]);
  });

  test('trims whitespace from lines and tags', () => {
    const responseWithWhitespace = '  Title with spaces  \n  tag1 , tag2 , tag3  \n  10-20  ';

    const result = parseListingResponse(responseWithWhitespace);

    expect(result.title).toBe('Title with spaces');
    expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
    expect(result.priceRange).toEqual([10, 20]);
  });
});

describe('titleContainsMinWords', () => {
  test('returns true when title has enough matching words', () => {
    const title = 'Vintage Leather Jacket';
    const original = 'Vintage leather jacket, worn once, size M';

    expect(titleContainsMinWords(title, original, 2)).toBe(true);
  });

  test('returns false when title has fewer matching words than required', () => {
    const title = 'Amazing Product';
    const original = 'Vintage leather jacket, worn once, size M';

    expect(titleContainsMinWords(title, original, 2)).toBe(false);
  });

  test('returns true when exactly minWords match', () => {
    const title = 'Vintage Jacket';
    const original = 'Vintage leather jacket worn once';

    expect(titleContainsMinWords(title, original, 2)).toBe(true);
  });

  test('is case insensitive', () => {
    const title = 'VINTAGE LEATHER';
    const original = 'vintage leather jacket';

    expect(titleContainsMinWords(title, original, 2)).toBe(true);
  });

  test('uses default minWords of 2 when not specified', () => {
    const title = 'Vintage Leather Something';
    const original = 'Vintage leather jacket';

    expect(titleContainsMinWords(title, original)).toBe(true);
  });

  test('handles empty original details', () => {
    const title = 'Some Title';
    const original = '';

    expect(titleContainsMinWords(title, original, 1)).toBe(false);
  });
});

jest.mock('@openrouter/sdk', () => {
  const mockSend = jest.fn();
  return {
    __esModule: true,
    default: undefined,
    OpenRouter: jest.fn().mockImplementation(() => ({
      chat: {
        send: mockSend,
      },
    })),
    _mockSend: mockSend,
  };
});

describe('beautifySellerDetails retries', () => {
  beforeEach(() => {
    const sdk = require('@openrouter/sdk') as any;
    sdk._mockSend.mockReset();
  });

  test('throws AppError after max retries exceeded', async () => {
    const sdk = require('@openrouter/sdk') as any;
    sdk._mockSend.mockRejectedValue(new Error('AI model error'));

    await expect(beautifySellerDetails('test details')).rejects.toThrow(AppError);
  }, 15000);

  test('thrown AppError has BEAUTIFIER_MAX_RETRIES code', async () => {
    const sdk = require('@openrouter/sdk') as any;
    sdk._mockSend.mockRejectedValue(new Error('AI model error'));

    let caught: unknown;
    try {
      await beautifySellerDetails('test details');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).code).toBe(ErrorCodes.BEAUTIFIER_MAX_RETRIES);
  }, 15000);
});
