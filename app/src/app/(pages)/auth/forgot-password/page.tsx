import Link from "next/link";

// constants
import { ROUTES } from "@/client/common/config";

// components
import ForgotPasswordForm from "@/client/modules/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full sm:max-w-xl lg:max-w-2xl m-auto flex bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="w-full p-6 sm:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <ForgotPasswordForm />
        <div className="mt-4 sm:mt-6 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-xs sm:text-sm text-main hover:text-main-dark"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
