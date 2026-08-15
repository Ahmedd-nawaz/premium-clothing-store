"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";

interface ProductGalleryProps {
  images: { url: string; alt: string }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted group">
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                i === activeIndex ? "border-primary" : "border-transparent hover:border-border"
              )}
              aria-label={`View image ${i + 1} of ${productName}`}
              aria-current={i === activeIndex}
            >
              <Image src={image.url} alt={image.alt} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
