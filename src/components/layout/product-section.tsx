"use client";

import React from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import Link from "next/link";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
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
    defaultVariantId?: string;
  }>;
  viewAllHref?: string;
  viewAllText?: string;
  columns?: 3 | 4 | 5;
  showQuickView?: boolean;
  onQuickView?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
  variant?: "default" | "featured";
  className?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllText = "View All",
  columns = 4,
  showQuickView = true,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  variant = "default",
  className,
}: ProductSectionProps) {
  return (
    <section className={cn("py-12 lg:py-16", className)} aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 self-end mb-1"
            >
              {viewAllText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${columns} gap-6 lg:gap-8`}
          role="list"
          aria-label={title}
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
              defaultVariantId={product.defaultVariantId}
              onQuickView={() => onQuickView?.(product.id)}
              onAddToCart={() => onAddToCart?.(product.id)}
              onToggleWishlist={() => onToggleWishlist?.(product.id)}
              isInWishlist={wishlistIds.includes(product.id)}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}