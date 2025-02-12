import { useFetch } from "@/client/common/hooks/use-fetch";
import { AxiosRequestConfig } from "axios";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function useResetPasswordLink() {
  const params = useSearchParams();
  const key = params.get("key");

  const requestBody: AxiosRequestConfig = useMemo(() => {
    return {
      method: "GET",
      params: {
        key,
      },
    };
  }, [key]);

  const { error, loading } = useFetch("/auth/validate-access-token", requestBody);

  return {
    isLinkValid: !error && !loading,
    isLinkValidLoading: loading,
    isLinkInvalid: error,
  };
}
