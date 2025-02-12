"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

// components
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";
import LoadingOverlay from "@/client/common/components/loading-overlay";

// config
import { ROUTES } from "@/client/common/config";

// hooks
import useResetPasswordForm from "../../hooks/use-reset-password-form";
import useResetPasswordLink from "../../hooks/use-reset-password-link";

const PasswordResetForm = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    handleSubmit,
    submissionError,
    isSubmitting,
    success,
  } = useResetPasswordForm();

  const { isLinkValid, isLinkValidLoading, isLinkInvalid } = useResetPasswordLink();

  if (isLinkValidLoading) {
    return <LoadingOverlay />;
  }

  if (isLinkInvalid) {
    return (
      <div className="mb-6 lg:mb-8 flex flex-col gap-10 text-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Sorry, the link is invalid or expired</h2>
          <p className="text-xs sm:text-base text-text-light mt-1 sm:mt-2">
            Please request a new password reset link by clicking below
          </p>
        </div>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-xs sm:text-sm text-main hover:text-main-dark"
        >
          Reset password
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mb-6 lg:mb-8 flex flex-col gap-10 text-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Password reset successful</h2>
          <p className="text-xs sm:text-base text-text-light mt-1 sm:mt-2">
            Please login with your new password
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-xs sm:text-sm text-main hover:text-main-dark"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    isLinkValid && (
      <>
        <div className="mb-6 lg:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Reset Password</h2>
          <p className="text-xs sm:text-sm text-text-light mt-1 sm:mt-2">Enter your new password</p>
        </div>

        <form
          className="space-y-4 sm:space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm font-medium text-text"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 h-8 sm:h-10 text-sm sm:text-base"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {validationErrors.password}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-medium text-text"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 h-8 sm:h-10 text-sm sm:text-base"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
          {submissionError && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center capitalize">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {submissionError}
            </p>
          )}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-main hover:bg-main-dark text-white h-8 sm:h-10 text-sm sm:text-base"
          >
            Submit
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-xs sm:text-sm text-[#0F9D58] hover:text-[#0B8043]"
          >
            Return to Login
          </Link>
        </div>
      </>
    )
  );
};

export default PasswordResetForm;
