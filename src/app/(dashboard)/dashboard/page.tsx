import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const session = await getServerSession();
  if (!session) redirect("/login?callbackUrl=/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s a look at your account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium mt-1">{user.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="text-sm font-medium mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
              <p className="text-sm font-medium mt-1">{user.phone || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium mt-1">{memberSince}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant={user.emailVerified ? "success" : "warning"}>
              {user.emailVerified ? "Email Verified" : "Email Not Verified"}
            </Badge>
            <Badge variant="outline">{user.role}</Badge>
            <Badge variant={user.status === "ACTIVE" ? "secondary" : "destructive"}>{user.status}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
