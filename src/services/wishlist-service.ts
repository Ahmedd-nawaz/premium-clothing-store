
import { prisma } from "@/lib/prisma";

export interface WishlistItemData {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  inStock: boolean;
  addedAt: Date;
}

export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId, variantId: null },
    select: { productId: true },
  });
  return items.map((item) => item.productId);
}

export async function getWishlist(userId: string): Promise<WishlistItemData[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId, variantId: null },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          variants: { where: { isActive: true } },
        },
      },
    },
  });

  return items
    .filter((item) => item.product.status === "ACTIVE")
    .map((item) => {
      const variants = item.product.variants;
      const cheapest = variants.length
        ? variants.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min))
        : null;
      const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

      return {
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        price: cheapest ? Number(cheapest.price) : 0,
        compareAtPrice: cheapest?.compareAtPrice ? Number(cheapest.compareAtPrice) : undefined,
        image: item.product.images[0]?.url ?? "",
        inStock: totalStock > 0,
        addedAt: item.createdAt,
      };
    });
}