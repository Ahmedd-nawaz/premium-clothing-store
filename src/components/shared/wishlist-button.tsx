"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  productId: string;
  variantId?: string;
  isInWishlist: boolean;
  onToggle: (productId: string, variantId?: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function WishlistButton({
  productId,
  variantId,
  isInWishlist,
  onToggle,
  disabled = false,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsAnimating(true);
    onToggle(productId, variantId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition-all duration-300",
        "bg-background border border-border hover:bg-muted",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        isInWishlist && "bg-danger/10 border-danger text-danger",
        isAnimating && "animate-pulse scale-110"
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
    >
      <Heart
        className={cn(
          "transition-all duration-300",
          iconSizes[size],
          isInWishlist && "fill-current",
          isAnimating && "animate-heartbeat"
        )}
      />
      {showLabel && (
        <span className="ml-2 text-sm font-medium hidden sm:inline">
          {isInWishlist ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}

// Add keyframes for heartbeat animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
    .animate-heartbeat {
      animation: heartbeat 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}