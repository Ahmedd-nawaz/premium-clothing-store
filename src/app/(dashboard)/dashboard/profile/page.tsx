import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { EditProfileForm } from "@/components/dashboard/edit-profile-form";

export default async function DashboardProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/login?callbackUrl=/dashboard/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true },
  });

  if (!user) redirect("/login");

  return <EditProfileForm initialName={user.name} initialPhone={user.phone ?? ""} />;
}
