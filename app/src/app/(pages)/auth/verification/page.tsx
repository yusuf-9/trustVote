
// components
import OtpForm from "@/client/modules/auth/components/otp-form";

export default function VerifyOtpPage() {
  return (
    <div className="w-full max-w-4xl m-auto flex bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="w-full p-6 sm:px-8 py-12 lg:px-12 lg:py-20 overflow-y-auto max-h-screen flex flex-col gap-10">
        <div className="mb-6 lg:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Enter Verification Code</h2>
          <p className="text-sm text-text-light mt-2">Please enter the code below to continue..</p>
        </div>
        <OtpForm />
      </div>
    </div>
  );
}
