"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { updateProfileSchema } from "@/features/user/schemas";

type UpdateProfileResult = { success: true } | { success: false; error: string };

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const session = await getServerSession();

  if (!session) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}