"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/contexts/wishlist-context";
import type { WishlistItemData } from "@/services/wishlist-service";

export function WishlistPageContent({ initialItems }: { initialItems: WishlistItemData[] }) {
  const { toggle } = useWishlist();
  const [items, setItems] = useState(initialItems);

  const handleRemove = async (productId: string) => {
    // Optimistic: remove from the visible list immediately, restore if
    // the server call somehow fails.
    const previous = items;
    setItems((current) => current.filter((item) => item.productId !== productId));
    const result = await toggle(productId);
    if (!result.success) setItems(previous);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">Your wishlist is empty.</p>
          <Link href="/shop" className="text-primary font-medium hover:underline underline-offset-4">
            Start browsing
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.productId} className="overflow-hidden group">
          <Link href={`/shop/${item.slug}`} className="relative aspect-square block bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
            {!item.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </Link>
          <CardContent className="p-3 space-y-1.5">
            <Link href={`/shop/${item.slug}`} className="font-medium text-sm line-clamp-1 hover:text-primary transition-colors">
              {item.name}
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
                {item.compareAtPrice && item.compareAtPrice > item.price && (
                  <span className="text-xs text-muted-foreground line-through">{formatCurrency(item.compareAtPrice)}</span>
                )}
              </div>
              <button
                onClick={() => handleRemove(item.productId)}
                className="p-1.5 rounded-md hover:bg-danger/10 hover:text-danger transition-colors"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
