import { useState, useCallback } from 'react';
import { ApiError } from '../services/apiError';

interface UseApiResult<T, Args extends any[]> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  execute: (...args: Args) => Promise<T>;
  reset: () => void;
}

export function useApi<T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>,
  initialData: T | null = null
): UseApiResult<T, Args> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}
