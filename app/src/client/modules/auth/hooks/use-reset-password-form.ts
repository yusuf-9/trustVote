"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

// hooks
import useRequestHandler from "@/client/common/hooks/use-fetch-handler";

type ValidationErrorsType = {
  password?: string;
  confirmPassword?: string;
};

export default function useResetPasswordForm() {
  const params = useSearchParams();
  const key = params.get("key");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsType>({});

  const { handleRequest, loading, success, error } = useRequestHandler();

  // Input sanitization utility
  const sanitizeInput = useCallback((value: string) => {
    return value.trim();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrorsType = {};

    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

    if (!sanitizedPassword) newErrors.password = "Password is required";
    else if (sanitizedPassword.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (sanitizedPassword !== sanitizedConfirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setValidationErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword, sanitizeInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleRequest(
        "/auth/reset-password",
        "post",
        () => {
        },
        {
          password: sanitizeInput(password),
          key: key,
        }
      );
    } catch (error) {
      console.error({ error });
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    handleSubmit,
    submissionError: error,
    isSubmitting: loading,
    success,
  };
}
