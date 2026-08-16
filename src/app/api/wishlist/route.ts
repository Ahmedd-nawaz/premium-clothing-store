import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getWishlistProductIds } from "@/services/wishlist-service";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ productIds: [] });

  const productIds = await getWishlistProductIds(session.user.id);
  return NextResponse.json({ productIds });
}