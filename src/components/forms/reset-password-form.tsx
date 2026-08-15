"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { resetPasswordSchema } from "@/features/auth/schemas";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ResetPasswordFormInput = z.input<typeof resetPasswordSchema>;
type ResetPasswordFormOutput = z.output<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const [error, setError] = useState<string | null>(
    urlError === "INVALID_TOKEN" ? "This reset link is invalid or has expired. Request a new one." : null
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput, unknown, ResetPasswordFormOutput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormOutput) => {
    if (!token) {
      setError("Missing reset token. Use the link from your email.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await resetPassword({ newPassword: data.password, token });

      if (res.error) {
        setError(res.error.message || "Failed to reset password. The link may have expired.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 max-w-sm">
        <div className="bg-success/10 text-success rounded-full w-12 h-12 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Password reset</h2>
        <p className="text-muted-foreground text-sm">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="p-3 text-sm rounded-md bg-danger/10 text-danger border border-danger/20 font-medium">
          {error}
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
        helperText="Must be 8+ characters with uppercase, lowercase, and numbers."
      />

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Resetting..." disabled={!token}>
        Reset Password
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-2">
        <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
