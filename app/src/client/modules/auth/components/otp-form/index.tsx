"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import OtpInput from "react-otp-input";

// components
import { Button } from "@/client/common/components/ui/button";

// hooks
import useOtpForm from "../../hooks/use-otp-form";
import useOtpResend from "../../hooks/use-otp-resend";

// utils
import { cn } from "@/client/common/utils";

const OtpForm: React.FC = () => {
  const router = useRouter();
  const { disableSubmit, error, handleSubmit, otp, setOtp, success, loading } = useOtpForm();
  const { handleResendOtp, resendOtpCountdown, isCountdownFinished, isResendingOtp } = useOtpResend();

  const otpActionMessageJSX = useMemo(() => {
    if (error) {
      return (
        <p className="mt-1 text-lg text-red-600 flex items-center justify-center">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {error}
        </p>
      );
    }

    if (success) {
      return <p className="mt-1 text-lg text-main text-center">OTP verified successfully. Redirecting to dashboard</p>;
    }

    if (isCountdownFinished) {
      return (
        <Button
          type="button"
          disabled={isResendingOtp}
          className="w-full text-text-light h-10 text-base"
          variant={"ghost"}
          onClick={handleResendOtp}
        >
          Resend OTP
        </Button>
      );
    }

    return <p className="mt-1 text-lg text-main text-center">Resend OTP in {resendOtpCountdown} seconds</p>;
  }, [error, handleResendOtp, isCountdownFinished, isResendingOtp, resendOtpCountdown, success]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 sm:gap-10"
    >
      <div className="flex flex-col gap-1">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="w-2"></span>}
          renderInput={props => <input {...props} />}
          containerStyle="flex justify-between max-w-xs mx-auto"
          inputStyle={cn(
            "h-12 !w-8 sm:!w-10 text-2xl border-2 rounded-md text-center focus:border-main focus:outline-none",
            error && "border-red-500"
          )}
        />
      </div>
      <div className="flex flex-col gap-4 items-center">
        {otpActionMessageJSX}
        <Button
          type="submit"
          disabled={disableSubmit || loading}
          className="w-full bg-main hover:bg-main-dark text-white h-10 text-base"
        >
          Verify
        </Button>
        <div className="mt-6 text-center">
          <a
            onClick={() => router.back()}
            className="text-sm text-main hover:text-main-dark cursor-pointer"
          >
            Go back
          </a>
        </div>
      </div>
    </form>
  );
};

export default OtpForm;
