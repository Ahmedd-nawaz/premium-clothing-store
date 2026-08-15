/**
 * Cart Service
 * Reads the current user's (or guest's) cart. Writes live in
 * src/actions/cart.ts — this file is read-only on purpose, so it's safe
 * to call from GET routes without accidentally creating empty carts.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export interface CartItemData {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
  inStock: boolean;
  maxQuantity: number;
}

export interface CartData {
  items: CartItemData[];
  subtotal: number;
  itemCount: number;
}

const EMPTY_CART: CartData = { items: [], subtotal: 0, itemCount: 0 };

async function findCurrentCartId(): Promise<string | null> {
  const session = await getServerSession();

  if (session) {
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, select: { id: true } });
    return cart?.id ?? null;
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session_id")?.value;
  if (!sessionId) return null;

  const cart = await prisma.cart.findUnique({ where: { sessionId }, select: { id: true } });
  return cart?.id ?? null;
}

// Exported for actions/cart.ts to verify a cart item actually belongs to
// the current user/guest before allowing an update or delete.
export const getCurrentCartId = findCurrentCartId;

export async function getCart(): Promise<CartData> {
  const cartId = await findCurrentCartId();
  if (!cartId) return EMPTY_CART;

  const items = await prisma.cartItem.findMany({
    where: { cartId },
    orderBy: { createdAt: "asc" },
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: true,
    },
  });

  const mapped: CartItemData[] = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    price: Number(item.variant.price),
    compareAtPrice: item.variant.compareAtPrice ? Number(item.variant.compareAtPrice) : undefined,
    quantity: item.quantity,
    image: item.product.images[0]?.url ?? "",
    color: item.variant.colorName,
    size: item.variant.sizeLabel,
    inStock: item.variant.stock > 0,
    maxQuantity: item.variant.stock,
  }));

  return {
    items: mapped,
    subtotal: mapped.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: mapped.reduce((sum, item) => sum + item.quantity, 0),
  };
}