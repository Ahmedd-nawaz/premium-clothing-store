import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getWishlist } from "@/services/wishlist-service";
import { WishlistPageContent } from "@/components/dashboard/wishlist-page-content";

export default async function WishlistPage() {
  const session = await getServerSession();
  if (!session) redirect("/login?callbackUrl=/dashboard/wishlist");

  const items = await getWishlist(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
        <p className="text-muted-foreground text-sm mt-1">Items you've saved for later.</p>
      </div>
      <WishlistPageContent initialItems={items} />
    </div>
  );
}
