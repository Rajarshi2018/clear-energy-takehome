/**
 * Single typed HTTP client used by all three apps.
 *
 * Handles:
 *  - success (parsed JSON body)
 *  - non-2xx responses -> ApiError
 *  - network failures (fetch throws) -> NetworkError
 *  - abort on unmount -> re-throws the native AbortError so callers can ignore it
 *  - idempotency key on writes -> wired now even though this task only has GET
 *    endpoints, so the pattern is already in place when writes (approve /
 *    assign / cash confirm, etc.) land in later phases.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed. Check your connection and try again.') {
    super(message);
    this.name = 'NetworkError';
  }
}

// In a real app this would come from an env config per build (dev/staging/prod).
// Hardcoded here since the take-home only targets the local json-server mock.
export const API_BASE_URL = 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  /** Only meaningful for non-GET requests. Auto-generated if omitted. */
  idempotencyKey?: string;
  headers?: Record<string, string>;
}

function generateIdempotencyKey(): string {
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, headers = {} } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (method !== 'GET') {
    finalHeaders['Idempotency-Key'] = options.idempotencyKey ?? generateIdempotencyKey();
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    // Let AbortError propagate as-is so callers (useAsyncResource) can
    // distinguish "component unmounted / refetch superseded" from a real failure.
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    throw new NetworkError();
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.message === 'string') {
        message = errorBody.message;
      }
    } catch {
      // Response body wasn't JSON (or was empty) — fall back to the default message.
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
