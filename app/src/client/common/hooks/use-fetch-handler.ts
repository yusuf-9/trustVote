import { useState, useCallback } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";

import axiosClientInstance from "@/client/common/services/axios/client-instance";

interface RequestState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export default function useRequestHandler() {
  const [state, setState] = useState<RequestState>({
    loading: false,
    error: null,
    success: false,
  });

  const handleRequest = useCallback(
    async <T = any>(
      url: string,
      method: "get" | "post" | "put" | "delete",
      successCallback: (data: T) => Promise<void> | void,
      body?: any,
      requestConfig?: AxiosRequestConfig,
      awaitCallback?: boolean
    ) => {
      setState({ loading: true, error: null, success: false });

      try {
        let response: AxiosResponse<{ data: T }>;

        switch (method?.toLowerCase()) {
          case "get":
            response = await axiosClientInstance.get<T>(url, requestConfig);
            break;
          case "post":
            response = await axiosClientInstance.post<T>(url, body, requestConfig);
            break;
          case "put":
            response = await axiosClientInstance.put<T>(url, body, requestConfig);
            break;
          case "delete":
            response = await axiosClientInstance.delete<T>(url, requestConfig);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        setState({ loading: false, error: null, success: true });

        if (awaitCallback) {
          await successCallback(response.data?.data);
          return;
        }
        
        successCallback(response.data?.data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err?.message : "Something went wrong";
        setState({ loading: false, error: errorMessage, success: false });
        throw err;
      }
    },
    []
  );

  return { ...state, handleRequest };
}
