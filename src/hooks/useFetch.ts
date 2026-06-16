import { useEffect, useState, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in ms
}

// Simple in-memory cache
const dataCache = new Map<string, CacheEntry<any>>();

export interface UseFetchOptions {
  cacheTime?: number; // Cache duration in ms (default: 5 minutes)
  skip?: boolean; // Skip fetching
  retries?: number; // Number of retries on failure
  delay?: number; // Delay before fetching in ms
}

/**
 * Optimized async data fetching hook with caching and retry logic
 * Features:
 * - Response caching with TTL
 * - Automatic retry on failure
 * - Prevents duplicate requests
 * - Graceful error handling
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: UseFetchOptions = {}
) {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    skip = false,
    retries = 3,
    delay = 0,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check cache
  const getCachedData = useCallback(() => {
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    dataCache.delete(cacheKey);
    return null;
  }, [cacheKey]);

  // Fetch data with retries
  const fetchData = useCallback(
    async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        const result = await fetchFn();

        // Cache the result
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTime,
        });

        setData(result);
        setLoading(false);
        retryCountRef.current = 0;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (retryCount < retries) {
          retryCountRef.current = retryCount + 1;
          // Exponential backoff: 1s, 2s, 4s
          const backoffDelay = Math.pow(2, retryCount) * 1000;
          timeoutRef.current = setTimeout(() => {
            fetchData(retryCount + 1);
          }, backoffDelay);
        } else {
          setError(error);
          setLoading(false);
        }
      }
    },
    [fetchFn, cacheKey, getCachedData, cacheTime, retries]
  );

  // Effect for fetching
  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(fetchData, delay);
    } else {
      fetchData();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchData, skip, delay]);

  return { data, loading, error, refetch: () => fetchData(0) };
}

/**
 * Clear all cached data
 */
export function clearFetchCache() {
  dataCache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearFetchCacheEntry(cacheKey: string) {
  dataCache.delete(cacheKey);
}

/**
 * Batch multiple async operations with controlled concurrency
 */
export async function batchAsync<T>(
  items: T[],
  asyncFn: (item: T) => Promise<any>,
  concurrency = 3
): Promise<any[]> {
  const results: any[] = [];
  const executing: Promise<any>[] = [];

  for (let i = 0; i < items.length; i++) {
    const promise = Promise.resolve(items[i]).then((item) => asyncFn(item));

    results.push(promise);

    if (concurrency <= items.length) {
      executing.push(
        promise.then(() => {
          executing.splice(executing.indexOf(promise), 1);
        })
      );

      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}
