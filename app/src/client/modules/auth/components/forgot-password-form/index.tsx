"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

// components
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";

// utils
import { cn } from "@/client/common/utils";

// hooks
import useRequestHandler from "@/client/common/hooks/use-fetch-handler";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const { handleRequest, loading, success } = useRequestHandler();

  const validateForm = () => {
    if (!email) return setError("Email is required");
    else if (!/\S+@\S+\.\S+/.test(email)) return setError("Email is invalid");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleRequest(
        "/auth/forgot-password",
        "post",
        () => {},
        {
          email: email.trim().toLowerCase(),
        },
        {
          withCredentials: false,
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong..");
    }
  };

  if (success) {
    return (
      <div className="mb-6 lg:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Password Reset Email Sent</h2>
        <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2">
          Please check your email for a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 lg:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Enter your email to reset your password</p>
      </div>
      <form
        className="space-y-4 sm:space-y-5"
        onSubmit={handleSubmit}
      >
        <div>
          <Label
            htmlFor="email"
            className="text-xs sm:text-sm font-medium text-gray-700"
          >
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn("mt-1 h-8 sm:h-10 text-sm sm:text-base", error && "border-red-500")}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center capitalize">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {error}
          </p>
        )}
        <Button
          disabled={loading}
          type="submit"
          className="w-full bg-[#0F9D58] hover:bg-[#0B8043] text-white h-8 sm:h-10 text-sm sm:text-base"
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
