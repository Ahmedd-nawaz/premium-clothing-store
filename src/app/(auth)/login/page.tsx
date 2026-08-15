import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}