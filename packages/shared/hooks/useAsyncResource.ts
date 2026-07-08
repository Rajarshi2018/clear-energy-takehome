import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

export type AsyncResource<T> = AsyncState<T> & { refetch: () => void };

/**
 * One hook, used by all three screens, so "loading / error / success" is
 * handled the same way everywhere instead of each screen reinventing it.
 * Aborts the in-flight request on unmount or when refetch() supersedes it.
 */
export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
): AsyncResource<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      });

    return () => controller.abort();
    // deps intentionally spread by caller; fetcher identity is expected to be stable per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, refetch };
}
