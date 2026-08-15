"use client";

import React from "react";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: { url: string; alt: string }[];
    badges?: ReadonlyArray<"new" | "sale" | "bestseller" | "low-stock">;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
  }>;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: number;
  onQuickView?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
  variant?: "default" | "compact" | "featured";
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  gap = 6,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  variant = "default",
  loading = false,
  emptyMessage = "No products found",
}: ProductGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  };

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  if (loading) {
    return (
      <div className={columnClasses[columns] + " " + gapClasses[gap as keyof typeof gapClasses]}>
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full py-16 text-center">
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div
      className={`${columnClasses[columns]} ${gapClasses[gap as keyof typeof gapClasses]}`}
      role="list"
      aria-label="Products"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          images={product.images}
          badges={product.badges}
          rating={product.rating}
          reviewCount={product.reviewCount}
          inStock={product.inStock}
          onQuickView={() => onQuickView?.(product.id)}
          onAddToCart={() => onAddToCart?.(product.id)}
          onToggleWishlist={() => onToggleWishlist?.(product.id)}
          isInWishlist={wishlistIds.includes(product.id)}
          variant={variant}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="flex flex-col rounded-xl overflow-hidden bg-card border border-border animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-5 bg-muted rounded w-1/4 mt-auto" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </article>
  );
}