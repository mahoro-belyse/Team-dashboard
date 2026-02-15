import { useState, useCallback, useEffect } from "react";

interface UseFakeApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  execute: (...args: any[]) => Promise<T | undefined>;
}

export function useFakeApi<T>(
  apiFn: (...args: any[]) => Promise<T>,
  args: any[] = [],
  immediate = true,
): UseFakeApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...callArgs: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...callArgs);
        setData(result);
        setLoading(false);
        return result;
      } catch (e: any) {
        setError(e.message || "An error occurred");
        setLoading(false);
        return undefined;
      }
    },
    [apiFn],
  );

  const retry = useCallback(() => {
    execute(...args);
  }, [execute, args]);

  useEffect(() => {
    if (immediate) execute(...args);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, retry, execute };
}
