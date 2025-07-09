// src/hooks/useFetchByRole
import { useEffect, useState } from 'react';

// Props
interface FetchConfig<T> {
  role: string;
  adminFetch: () => Promise<T>;
  selfFetch: () => Promise<T>;
}

export function useFetchByRole<T>({ role, adminFetch, selfFetch }: FetchConfig<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetcher = role === 'admin' ? adminFetch : selfFetch;

    fetcher()
      .then((res) => setData(res))
      .catch((error) => setError(error?.message ?? 'Error'))
      .finally(() => setLoading(false));
  }, [role, adminFetch, selfFetch]);

  return { data, loading, error };
}
