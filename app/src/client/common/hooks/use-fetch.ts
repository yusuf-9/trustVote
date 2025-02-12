import axiosClientInstance from "@/client/common/services/axios/client-instance";
import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T = any>(url: string, options?: AxiosRequestConfig): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClientInstance.get<T>(url, {
          ...options,
          signal: controller.signal,
        });

        setData(response.data?.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "canceled") {
          const errorMessage = err?.message;
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [options, url]);

  return { data, loading, error };
};
