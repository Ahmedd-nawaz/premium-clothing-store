"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { getOrCreateCartSessionId } from "@/lib/cart-session";
import { getCurrentCartId } from "@/services/cart-service";

type AddToCartResult = { success: true; quantityInCart: number } | { success: false; error: string };

export async function addToCart(variantId: string, quantity: number): Promise<AddToCartResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: "Invalid quantity." };
  }

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.isActive) {
    return { success: false, error: "This item is no longer available." };
  }
  if (variant.stock < 1) {
    return { success: false, error: "This item is out of stock." };
  }

  const session = await getServerSession();

  const cart = session
    ? await prisma.cart.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
      })
    : await (async () => {
        const sessionId = await getOrCreateCartSessionId();
        return prisma.cart.upsert({
          where: { sessionId },
          update: {},
          create: { sessionId },
        });
      })();

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  const desiredQuantity = (existingItem?.quantity ?? 0) + quantity;
  const clampedQuantity = Math.min(desiredQuantity, variant.stock);

  const cartItem = await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: clampedQuantity },
    create: { cartId: cart.id, productId: variant.productId, variantId, quantity: clampedQuantity },
  });

  return { success: true, quantityInCart: cartItem.quantity };
}

type MutationResult = { success: true } | { success: false; error: string };

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<MutationResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: "Invalid quantity." };
  }

  const currentCartId = await getCurrentCartId();
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { variant: true } });

  // Ownership check: the cart item must belong to the current user's/guest's
  // own cart — otherwise anyone could edit anyone else's cart by id.
  if (!item || !currentCartId || item.cartId !== currentCartId) {
    return { success: false, error: "Cart item not found." };
  }

  const clampedQuantity = Math.min(quantity, item.variant.stock);
  await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity: clampedQuantity } });

  return { success: true };
}

export async function removeCartItem(cartItemId: string): Promise<MutationResult> {
  const currentCartId = await getCurrentCartId();
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });

  if (!item || !currentCartId || item.cartId !== currentCartId) {
    return { success: false, error: "Cart item not found." };
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return { success: true };
}