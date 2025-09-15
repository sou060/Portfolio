import { useState, useEffect, useCallback } from 'react';
import type { AsyncState, UseApiOptions } from '@/types';
import { getErrorMessage } from '@/utils';

interface ApiState<T> extends AsyncState<T> {
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
  retryCount: number;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): ApiState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const [retryCount, setRetryCount] = useState(0);
  const { immediate = true, onSuccess, onError } = options;

  const executeApiCall = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ data: null, loading: false, error: errorMessage });
      
      if (onError) {
        onError(error);
      }
    }
  }, [apiCall, onSuccess, onError]);

  const refetch = useCallback(async () => {
    setRetryCount(0);
    await executeApiCall();
  }, [executeApiCall]);

  const retry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    await executeApiCall();
  }, [executeApiCall]);

  useEffect(() => {
    if (immediate) {
      executeApiCall();
    }
  }, [immediate, executeApiCall]);

  return {
    ...state,
    refetch,
    retry,
    retryCount,
  };
}

// Hook for API calls with automatic retry on failure
export function useApiWithRetry<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions & { maxRetries?: number; retryDelay?: number } = {}
): ApiState<T> {
  const { maxRetries = 3, retryDelay = 1000, ...apiOptions } = options;
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  const state = useApi(apiCall, {
    ...apiOptions,
    onError: (error) => {
      if (retryAttempts < maxRetries) {
        setTimeout(() => {
          setRetryAttempts(prev => prev + 1);
        }, retryDelay * Math.pow(2, retryAttempts)); // Exponential backoff
      }
      
      if (apiOptions.onError) {
        apiOptions.onError(error);
      }
    },
  });

  useEffect(() => {
    if (retryAttempts > 0 && retryAttempts <= maxRetries) {
      state.retry();
    }
  }, [retryAttempts, maxRetries, state.retry]);

  return {
    ...state,
    retryCount: retryAttempts,
  };
}

// Hook for polling API calls
export function usePolling<T>(
  apiCall: () => Promise<T>,
  interval: number = 5000,
  options: UseApiOptions & { enabled?: boolean } = {}
): ApiState<T> {
  const { enabled = true, ...apiOptions } = options;
  const state = useApi(apiCall, apiOptions);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      state.refetch();
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval, state.refetch]);

  return state;
}

export default useApi;
