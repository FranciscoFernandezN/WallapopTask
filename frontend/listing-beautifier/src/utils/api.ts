import { env, getBackendUrl } from './env.ts';
import { DeprecationError, mapErrorCode } from './errors.ts';
import type { BeautifySellerDetailsRequest, BeautifySellerDetailsResponse } from '../../../../shared/types/beautify.ts';

/**
 * Generic HTTP request wrapper with timeout and error mapping.
 *
 * Combines an optional caller-provided `AbortSignal` with an internal
 * timeout signal. Checks for the `deprecation-date` response header
 * and maps backend error codes to typed `BackendError` subclasses.
 *
 * @typeParam T - Expected shape of the JSON response body.
 * @param path - API path appended to the backend base URL.
 * @param options - Standard `RequestInit` with an optional `signal`.
 * @returns Parsed JSON response typed as `T`.
 * @throws {DeprecationError} When the response contains a `deprecation-date` header.
 * @throws {BackendError} When the response is not OK and contains a known error code.
 * @throws {Error} When the response is not OK and no error code is present.
 */
async function request<T>(path: string, options: RequestInit & { signal?: AbortSignal }): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.backendTimeout);

  const combinedSignal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(`${getBackendUrl()}${path}`, {
      ...options,
      signal: combinedSignal,
    });

    const deprecationDate = response.headers.get('deprecation-date');
    if (deprecationDate) {
      throw new DeprecationError(new Date(deprecationDate));
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      if (body?.code) {
        throw mapErrorCode(body.code);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Sends a beautify request to the backend API.
 *
 * @param sellerDetails - Request body containing the raw seller description.
 * @param signal - Optional `AbortSignal` to cancel the request.
 * @returns The beautified listing with title, tags, and price range.
 */
export function sendBeautifySellerDetails(
  sellerDetails: BeautifySellerDetailsRequest,
  signal?: AbortSignal
): Promise<BeautifySellerDetailsResponse> {
  return request<BeautifySellerDetailsResponse>('/v1/seller/listing-beautifier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sellerDetails),
    signal,
  });
}
