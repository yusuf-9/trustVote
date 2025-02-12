import { ROUTES } from "@/client/common/config";
import RegisterForm from "@/client/modules/auth/components/register-form/index.";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full sm:max-w-xl lg:max-w-2xl m-auto flex bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="w-full p-6 sm:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <div className="mb-6 lg:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Create an account</h2>
          <p className="text-xs sm:text-sm text-text-light mt-1 sm:mt-2">Create an account to get started</p>
        </div>
        <RegisterForm />
        <div className="mt-4 sm:mt-6 flex items-center justify-center text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-xs sm:text-sm text-main hover:text-main-dark"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
