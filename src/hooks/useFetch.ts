import { useEffect, useState } from 'react';

type GetType<T> = () => Promise<T[]>;

export const useFetch = <T>(getService : GetType<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    setError(null)
    try {
      const response = await getService();
      setData(response)
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getData,
  };
};
