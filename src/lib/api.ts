// ============================================================
// Type-safe API client
//
// WHY: The original GetApi.js had two critical bugs:
//   1. It returned a Promise without awaiting it, then checked
//      .code on the Promise object (always undefined).
//   2. HEADERGET/HEADERPOST were mutated directly, causing
//      race conditions when multiple requests overlap.
//
// This client creates fresh RequestInit objects per call,
// never mutating shared state.
// ============================================================

import { ApiResponse } from './types';
import { TOKEN_KEY } from './constants';

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
} as const;

/** Retrieve the stored auth token */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Build Authorization header if token exists */
function authHeader(token?: string): Record<string, string> {
  const t = token ?? getToken();
  if (!t) return {};
  return { Authorization: `Bearer ${t}` };
}

/**
 * Perform an authenticated GET request.
 * Returns a typed ApiResponse<T>.
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> {
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      ...JSON_HEADERS,
      ...authHeader(token),
    },
  });
  return res.json() as Promise<ApiResponse<T>>;
}

/**
 * Perform an authenticated POST request.
 * Returns a typed ApiResponse<T>.
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  body: object,
  token?: string
): Promise<ApiResponse<T>> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      ...authHeader(token),
    },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<ApiResponse<T>>;
}
