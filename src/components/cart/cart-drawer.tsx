"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Plus, Minus, Trash2, Heart, ChevronRight, ShoppingBag } from "lucide-react";
import { cn, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";

interface CartItem {
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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddToWishlist?: (itemId: string) => void;
  isLoading?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onAddToWishlist,
  isLoading = false,
}: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col animate-slide-in",
          "lg:max-w-lg"
        )}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <h2 className="font-display text-xl lg:text-2xl font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Looks like you haven't added any items yet.
              </p>
              <Button onClick={onClose} fullWidth className="max-w-xs">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                    aria-label={item.name}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-medium text-sm line-clamp-1 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{item.color}</span>
                        <span>·</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(item.compareAtPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity || isLoading}
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {onAddToWishlist && (
                          <button
                            onClick={() => onAddToWishlist(item.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Move to wishlist"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 lg:p-6 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && subtotal > 0 && (
                <p className="text-xs text-accent text-center">
                  Add {formatCurrency(200 - subtotal)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-5 space-x-0.5">
              <Link href="/checkout" onClick={onClose}>
                <Button fullWidth size="lg" className="cursor-pointer">
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button className="cursor-pointer" variant="outline" onClick={onClose} fullWidth>
                Continue Shopping
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Shipping and payment details collected at checkout.
            </p>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}
