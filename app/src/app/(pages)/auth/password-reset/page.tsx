// components
import PasswordResetForm from "@/client/modules/auth/components/password-reset-form";

export default function PasswordResetPage() {
  return (
    <div className="w-full sm:max-w-xl lg:max-w-2xl m-auto flex bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="w-full p-6 sm:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <PasswordResetForm />
      </div>
    </div>
  );
}
