"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle } from "lucide-react";

// components
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { Label } from "@/client/common/components/ui/label";

// constants
import { ROUTES } from '@/client/common/config';
import { CREDENTIALS_LOGIN_ERRORS } from '@/common/constants';

// types
import { cn } from '@/client/common/utils';

const LoginForm = () => {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email) return setError("Email is required");
        else if (!/\S+@\S+\.\S+/.test(email)) return setError("Email is invalid");
        if (!password) return setError("Password is required");
        else if (password.length < 8) return setError("Password must be at least 8 characters");

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('')
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (!result || result.error) {
                throw new Error(
                    result?.error ?? "An unexpected error has occurred"
                )
            }

            router.replace(ROUTES.DASHBOARD)
        } catch (error: unknown) {
            if (error instanceof Error) {
                switch (error.message) {
                    case CREDENTIALS_LOGIN_ERRORS.UNVERIFIED_USER:
                        router.push(ROUTES.EMAIL_VERIFICATION + `?email=${email}`)
                        break;
                    default:
                        setError(error.message ?? "An unexpected error has occurred");
                        break;
                }
                return;
            }
            setError("Something went wrong. Please try again later")
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
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
                        className={cn("mt-1 h-8 sm:h-10 text-sm sm:text-base", error && 'border-red-500')}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="password"
                        className="text-xs sm:text-sm font-medium text-gray-700"
                    >
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={cn("mt-1 h-8 sm:h-10 text-sm sm:text-base", error && 'border-red-500')}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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
                    Login
                </Button>
            </form>
            <div className="mt-4 sm:mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>
                <div className="mt-4 sm:mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-8 sm:h-10 text-xs sm:text-sm"
                        onClick={() => {
                            signIn("google", {
                                redirect: false,
                                callbackUrl: window.location.origin + ROUTES.DASHBOARD,
                            });
                        }}
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
                        Google
                    </Button>
                </div>
            </div>
        </>
    )
}

export default LoginForm