import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-semibold">Reset your password</h1>
          <p className="text-muted-foreground">We&apos;ll email you instructions to reset your password.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}