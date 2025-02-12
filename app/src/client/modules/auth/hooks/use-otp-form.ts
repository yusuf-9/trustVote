import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { ROUTES } from "@/client/common/config";

export default function useRegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const disableSubmit = otp?.length !== 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disableSubmit) return;

    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        otp,
        email,
      });
      if (!result || result.error) {
        throw new Error(result?.error ?? "An unexpected error has occurred");
      }

      setSuccess(true);
      setTimeout(() => router.replace(ROUTES.DASHBOARD), 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message ?? "An unexpected error has occurred");
        return;
      }
      setError("Something went wrong. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    disableSubmit,
    handleSubmit,
    error,
    success,
    loading,
  };
}
