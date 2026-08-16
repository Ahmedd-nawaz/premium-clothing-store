"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { toggleWishlist as toggleWishlistAction } from "@/actions/wishlist";
import { useSession } from "@/lib/auth-client";

interface WishlistContextValue {
  wishlistIds: Set<string>;
  isLoading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<{ success: boolean; error?: string }>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!session) {
      setWishlistIds(new Set());
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(new Set(data.productIds));
      }
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!session) return { success: false, error: "Sign in to save items to your wishlist." };

      // Optimistic update — flip it locally right away, then reconcile
      // with what the server actually did (it's the source of truth if
      // this fails or another tab already changed it).
      const wasWishlisted = wishlistIds.has(productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.delete(productId);
        else next.add(productId);
        return next;
      });

      const result = await toggleWishlistAction(productId);

      if (!result.success) {
        // revert on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (wasWishlisted) next.add(productId);
          else next.delete(productId);
          return next;
        });
        return { success: false, error: result.error };
      }

      return { success: true };
    },
    [session, wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, isLoading, isWishlisted: (id) => wishlistIds.has(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
