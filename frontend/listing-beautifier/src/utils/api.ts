import { env, getBackendUrl } from './env.ts';
import { DeprecationError } from './errors.ts';
import type { BeautifySellerDetailsRequest, BeautifySellerDetailsResponse } from '../../../../shared/types/beautify.ts';

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
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

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
