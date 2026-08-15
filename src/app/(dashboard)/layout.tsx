import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already guards /dashboard/*, but this
  // keeps the layout safe even if it's ever rendered outside that matcher.
  const session = await getServerSession();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Premium Clothing Store
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside>
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
