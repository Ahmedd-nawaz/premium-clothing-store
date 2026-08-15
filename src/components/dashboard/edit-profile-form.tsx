"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/actions/user";

interface EditProfileFormProps {
  initialName: string;
  initialPhone: string;
}

export function EditProfileForm({ initialName, initialPhone }: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4 max-w-md">
          {error && (
            <div className="p-3 text-sm rounded-md bg-danger/10 text-danger border border-danger/20 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm rounded-md bg-success/10 text-success border border-success/20 font-medium">
              Profile updated successfully.
            </div>
          )}

          <Input label="Full Name" name="name" defaultValue={initialName} required minLength={2} />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            defaultValue={initialPhone}
            placeholder="+92 300 1234567"
          />

          <Button type="submit" loading={isPending} loadingText="Saving...">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
