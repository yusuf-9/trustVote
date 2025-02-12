"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

// components
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";

// hooks
import useRegisterForm from "../../hooks/use-register-form";

const RegisterForm: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    isSubmitting,
    handleSubmit,
    registrationError,
  } = useRegisterForm();

  return (
    <>
      <form
        className="space-y-4 sm:space-y-5"
        onSubmit={handleSubmit}
      >
        <div>
          <Label
            htmlFor="name"
            className="text-xs sm:text-sm font-medium text-text"
          >
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 h-8 sm:h-10 text-sm sm:text-base"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {validationErrors.name && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {validationErrors.name}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor="email"
            className="text-xs sm:text-sm font-medium text-text"
          >
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 h-8 sm:h-10 text-sm sm:text-base"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {validationErrors.email}
            </p>
          )}
        </div>
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
          {registrationError && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {registrationError}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-main hover:bg-main-dark text-white h-8 sm:h-10 text-sm sm:text-base"
        >
          Register
        </Button>
      </form>
      <div className="mt-4 sm:mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-text-lighter"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-white text-text-light">Or</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-8 sm:h-10 text-xs sm:text-sm"
            onClick={() => signIn("google")}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Register with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
