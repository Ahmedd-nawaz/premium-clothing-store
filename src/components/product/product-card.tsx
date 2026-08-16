"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { cn, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/actions/cart";
import { useWishlist } from "@/contexts/wishlist-context";

interface ProductCardProps {
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
  // The variant actually added when the quick-add button on the card
  // itself is clicked (as opposed to the product detail page, where the
  // shopper picks a specific color/size first). Without this, the card's
  // Add to Cart button has nothing to add and silently does nothing.
  defaultVariantId?: string;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isInWishlist?: boolean;
  variant?: "default" | "compact" | "featured";
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  images,
  badges = [],
  rating,
  reviewCount,
  inStock = true,
  defaultVariantId,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  variant = "default",
}: ProductCardProps) {
  const primaryImage = images[0]?.url;
  const hoverImage = images[1]?.url || images[0]?.url;
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const wishlist = useWishlist();
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  // Always reflects real saved state from context — a parent-supplied
  // isInWishlist/onToggleWishlist pair (if any) is treated as an optional
  // extra notification hook, not a takeover, so this never silently
  // no-ops just because *some* callback happened to be passed in.
  const effectiveIsInWishlist = wishlist.isWishlisted(id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onToggleWishlist?.();

    setWishlistError(null);
    const result = await wishlist.toggle(id);
    if (!result.success && result.error) setWishlistError(result.error);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Let a caller-supplied handler override this (e.g. for analytics),
    // but still perform the real cart write below regardless — the two
    // aren't mutually exclusive.
    onAddToCart?.();

    if (!defaultVariantId) return;

    setCartError(null);
    startTransition(async () => {
      const result = await addToCart(defaultVariantId, 1);
      if (!result.success) {
        setCartError(result.error);
        return;
      }
      setJustAdded(true);
      window.dispatchEvent(new Event("cart:updated"));
      setTimeout(() => setJustAdded(false), 1800);
    });
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/shop/${slug}`}
        className="group flex gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        aria-label={name}
      >
        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={images[0]?.alt || name}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">{formatCurrency(price)}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(compareAtPrice!)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:shadow-xl hover:border-accent/50",
        variant === "featured" && "lg:grid lg:grid-cols-2"
      )}
    >
      {/* Image Gallery */}
      <Link href={`/shop/${slug}`} className="relative aspect-square overflow-hidden" aria-label={name}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={images[0]?.alt || name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={variant === "featured"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}

          {/* Hover Image */}
          {hoverImage && hoverImage !== primaryImage && (
            <Image
              src={hoverImage}
              alt={images[1]?.alt || name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
            />
          )}

          {/* Badges */}
          {(badges.length > 0 || hasDiscount) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {hasDiscount && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  -{discountPercent}%
                </Badge>
              )}
              {badges.map((badge) => (
                <Badge
                  key={badge}
                  variant={badge === "sale" ? "destructive" : badge === "new" ? "accent" : "secondary"}
                  className="text-xs px-2 py-0.5 capitalize"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-background hover:shadow-md",
              effectiveIsInWishlist && "opacity-100 text-danger"
            )}
            aria-label={effectiveIsInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-5 h-5 transition-colors", effectiveIsInWishlist && "fill-current")} />
          </button>

          {/* Quick View */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-background hover:shadow-md translate-y-2 group-hover:translate-y-0"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/shop/${slug}`} className="group" aria-label={name}>
          <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex" aria-label={`${rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent">
                  {star <= Math.round(rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            {reviewCount && (
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-semibold text-base">{formatCurrency(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          className="mt-3 w-full"
          fullWidth
          size="sm"
          disabled={!inStock || isPending}
          loading={isPending}
          loadingText="Adding..."
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-1" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>

        {cartError && <p className="text-xs text-danger mt-1.5">{cartError}</p>}
        {wishlistError && <p className="text-xs text-danger mt-1.5">{wishlistError}</p>}
      </div>
    </article>
  );
}
