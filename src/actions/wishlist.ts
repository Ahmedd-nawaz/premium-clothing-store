"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

type ToggleResult = { success: true; isWishlisted: boolean } | { success: false; error: string };

export async function toggleWishlist(productId: string): Promise<ToggleResult> {
  const session = await getServerSession();
  if (!session) return { success: false, error: "Sign in to save items to your wishlist." };

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return { success: false, error: "Product not found." };

  const existing = await prisma.wishlist.findFirst({
    where: { userId: session.user.id, productId, variantId: null },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { success: true, isWishlisted: false };
  }

  await prisma.wishlist.create({
    data: { userId: session.user.id, productId, variantId: null },
  });
  return { success: true, isWishlisted: true };
}