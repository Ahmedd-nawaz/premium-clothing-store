"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForgotPasswordFormInput = z.input<typeof forgotPasswordSchema>;
type ForgotPasswordFormOutput = z.output<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInput, unknown, ForgotPasswordFormOutput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormOutput) => {
    setError(null);
    setLoading(true);

    try {
      // Using the better-auth client's forgot password functionality
      // This will need to be adapted based on the actual API
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, redirectTo: "/reset-password" }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message || "Failed to send reset email");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
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
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          We have sent password reset instructions to your email address.
        </p>
        <Button variant="outline" fullWidth onClick={() => (window.location.href = "/login")}>
          Back to login
        </Button>
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

      <p className="text-muted-foreground text-sm">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Sending...">
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-2">
        <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
