"use client";

import { useState } from "react";
import { WishlistButton } from "@/components/shared/wishlist-button";
import { useWishlist } from "@/contexts/wishlist-context";

export function ProductWishlistButton({ productId }: { productId: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setError(null);
    const result = await toggle(productId);
    if (!result.success && result.error) setError(result.error);
  };

  return (
    <div>
      <WishlistButton productId={productId} isInWishlist={isWishlisted(productId)} onToggle={handleToggle} showLabel size="lg" />
      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  );
}
