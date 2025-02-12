import { ROUTES } from "@/client/common/config";
import LoginForm from "@/client/modules/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full sm:max-w-xl lg:max-w-2xl m-auto flex bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="w-full p-6 sm:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <div className="mb-6 lg:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-text-light mt-1 sm:mt-2">Login using your credentials</p>
        </div>
        <LoginForm />
        <div className="mt-4 sm:mt-6 flex items-center justify-between text-center">
          <Link
            href={ROUTES.REGISTER}
            className="text-xs sm:text-sm text-main hover:text-main-dark"
          >
            Dont&apos;t have an account? Register
          </Link>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-xs sm:text-sm text-main hover:text-main-dark"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
