import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import useRequestHandler from "@/client/common/hooks/use-fetch-handler";
import { toast } from "@/client/common/hooks/use-toast";

export default function useOtpResend() {
  const params = useSearchParams();
  const email = params.get("email");

  const { error: resendOtpError, handleRequest, loading: isResendingOtp } = useRequestHandler();

  const [resendOtpCountdown, setResendOtpCountdown] = useState<number>(60);
  const resetCountdownRef = useRef<NodeJS.Timeout | null>(null);

  const isCountdownFinished = resendOtpCountdown === 0;

  const handleResendOtp = useCallback(async () => {
    try {
      await handleRequest(
        "/auth/resend-otp",
        "post",
        () => {
          toast({
            title: "OTP resent successfully",
            variant: "success",
          });
        },
        { email }
      );
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: error instanceof Error ? error.message : "An unexpected error has occurred",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setResendOtpCountdown(60);
      resetCountdownRef.current = setInterval(() => {
        setResendOtpCountdown(prev => {
          if (prev > 0) {
            return prev - 1;
          }

          clearInterval(resetCountdownRef.current!);
          return 0;
        });
      }, 1000);
    }
  }, [email, handleRequest]);

  useEffect(() => {
    resetCountdownRef.current = setInterval(() => {
      setResendOtpCountdown(prev => {
        if (prev > 0) {
          return prev - 1;
        }

        clearInterval(resetCountdownRef.current!);
        return 0;
      });
    }, 1000);

    return () => {
      if (resetCountdownRef.current) {
        clearInterval(resetCountdownRef.current);
      }
    };
  }, []);

  return {
    handleResendOtp,
    isResendingOtp,
    resendOtpError,
    resendOtpCountdown,
    isCountdownFinished,
  };
}
