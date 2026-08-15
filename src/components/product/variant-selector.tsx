"use client";

import { useMemo, useState, useTransition } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { cn, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";
import type { ProductVariantData } from "@/services/product-service";

interface VariantSelectorProps {
  variants: ProductVariantData[];
}

export function VariantSelector({ variants }: VariantSelectorProps) {
  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of variants) seen.set(v.colorName, v.colorHex);
    return [...seen.entries()].map(([name, hex]) => ({ name, hex }));
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? "");
  const sizesForColor = variants.filter((v) => v.colorName === selectedColor);
  const [selectedSizeName, setSelectedSizeName] = useState(sizesForColor[0]?.sizeName ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectedVariant = variants.find((v) => v.colorName === selectedColor && v.sizeName === selectedSizeName);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const firstSizeForNewColor = variants.find((v) => v.colorName === colorName);
    setSelectedSizeName(firstSizeForNewColor?.sizeName ?? "");
    setFeedback(null);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, quantity);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error });
        return;
      }
      setFeedback({ type: "success", message: `Added to cart (${result.quantityInCart} total in cart).` });
      window.dispatchEvent(new Event("cart:updated"));
    });
  };

  if (!selectedVariant) {
    return <p className="text-sm text-muted-foreground">This product has no purchasable options right now.</p>;
  }

  const hasDiscount = selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price;
  const outOfStock = selectedVariant.stock < 1;
  const lowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold">{formatCurrency(selectedVariant.price)}</span>
        {hasDiscount && (
          <span className="text-lg text-muted-foreground line-through">
            {formatCurrency(selectedVariant.compareAtPrice!)}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          Color: <span className="text-muted-foreground">{selectedColor}</span>
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-all",
                selectedColor === color.name ? "border-primary scale-110" : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
              aria-pressed={selectedColor === color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedSizeName(v.sizeName)}
              disabled={v.stock < 1}
              className={cn(
                "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                selectedSizeName === v.sizeName
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary",
                v.stock < 1 && "opacity-40 cursor-not-allowed line-through"
              )}
              aria-pressed={selectedSizeName === v.sizeName}
            >
              {v.sizeLabel}
            </button>
          ))}
        </div>
      </div>

      <div>
        {outOfStock ? (
          <p className="text-sm font-medium text-danger">Out of stock</p>
        ) : lowStock ? (
          <p className="text-sm font-medium text-warning">Only {selectedVariant.stock} left</p>
        ) : (
          <p className="text-sm text-success font-medium">In stock</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border rounded-md">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-muted transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-4 py-2 text-sm font-medium min-w-[2.5rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
            className="px-3 py-2 hover:bg-muted transition-colors"
            aria-label="Increase quantity"
            disabled={quantity >= selectedVariant.stock}
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={outOfStock}
          loading={isPending}
          loadingText="Adding..."
          fullWidth
          size="lg"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>

      {feedback && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-md text-sm font-medium",
            feedback.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}
        >
          {feedback.type === "success" && <Check className="w-4 h-4" />}
          {feedback.message}
        </div>
      )}
    </div>
  );
}
