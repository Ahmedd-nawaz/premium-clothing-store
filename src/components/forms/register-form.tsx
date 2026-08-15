"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { registerSchema } from "@/features/auth/schemas";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// registerSchema uses .refine() and .default(), which makes Zod's input
// type (before defaults are applied) and output type (after) diverge.
// react-hook-form's generic needs to match the *input* shape since that's
// what the form fields actually produce; passing input/output explicitly
// like this keeps that correct without silencing the type checker.
type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormOutput = z.output<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput, unknown, RegisterFormOutput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormOutput) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (res.error) {
        setError(res.error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {error && (
        <div className="p-3 text-sm rounded-md bg-danger/10 text-danger border border-danger/20 font-medium">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
        helperText="Must be 8+ characters with uppercase, lowercase, and numbers."
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground pt-1">
        <input
          type="checkbox"
          className="rounded border-border text-primary focus:ring-ring"
          {...register("marketingConsent")}
        />
        Subscribe to our newsletter for exclusive updates
      </label>

      <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Creating account...">
        Create Account
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
