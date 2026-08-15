import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-semibold">Create an account</h1>
          <p className="text-muted-foreground">Join us to start your premium shopping experience.</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}