"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { loginSchema } from "@/features/auth/schemas";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// loginSchema has .default(false) on rememberMe, so input/output types
// diverge slightly — see the note in register-form.tsx for why this
// matters for the resolver's generic.
type LoginFormInput = z.input<typeof loginSchema>;
type LoginFormOutput = z.output<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput, unknown, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormOutput) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid email or password");
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
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-ring"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-primary hover:underline underline-offset-4 text-xs"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Signing in...">
        Sign In
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
          Create account
        </Link>
      </p>
    </form>
  );
}
