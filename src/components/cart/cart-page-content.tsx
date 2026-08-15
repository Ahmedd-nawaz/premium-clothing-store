"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import type { CartData } from "@/services/cart-service";

export function CartPageContent({ cart }: { cart: CartData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const shipping = cart.subtotal > 200 ? 0 : 15;
  const total = cart.subtotal + shipping;

  const handleUpdate = (itemId: string, quantity: number) => {
    if (quantity < 1) return handleRemove(itemId);
    startTransition(async () => {
      await updateCartItemQuantity(itemId, quantity);
      window.dispatchEvent(new Event("cart:updated"));
      router.refresh();
    });
  };

  const handleRemove = (itemId: string) => {
    startTransition(async () => {
      await removeCartItem(itemId);
      window.dispatchEvent(new Event("cart:updated"));
      router.refresh();
    });
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 divide-y divide-border border-y border-border">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 py-6">
            <Link href={`/shop/${item.slug}`} className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <Link href={`/shop/${item.slug}`} className="font-medium hover:text-primary transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.color} · {item.size}
                </p>
                {!item.inStock && <p className="text-sm text-danger font-medium mt-1">Out of stock</p>}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity - 1)}
                    disabled={isPending}
                    className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                    disabled={isPending || item.quantity >= item.maxQuantity}
                    className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={isPending}
                    className="p-2 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-xl border border-border p-6 space-y-4 sticky top-24">
          <h2 className="font-display text-lg font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Shipping</span>
              <span className="font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-accent">Add {formatCurrency(200 - cart.subtotal)} more for free shipping!</p>
            )}
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button fullWidth size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center">
            Shipping and payment details collected at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
