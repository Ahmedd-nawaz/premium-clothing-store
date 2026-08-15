"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt: string;
  productCount?: number;
  ctaText?: string;
}

interface FeaturedCollectionsProps {
  title?: string;
  subtitle?: string;
  collections: CollectionItem[];
  columns?: 2 | 3;
  className?: string;
}

export function FeaturedCollections({
  title = "Featured Collections",
  subtitle = "Curated selections for every occasion",
  collections,
  columns = 2,
  className,
}: FeaturedCollectionsProps) {
  const columnClasses = {
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <section className={cn("py-12 lg:py-16", className)} aria-labelledby="collections-heading">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 id="collections-heading" className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-base mt-2">{subtitle}</p>
          )}
        </div>

        <div
          className={`${columnClasses[columns]} gap-6 lg:gap-8`}
          role="list"
          aria-label="Featured collections"
        >
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="group relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <Link
                href={`/shop/${collection.slug}`}
                className="block h-full w-full"
                aria-label={collection.name}
              >
                <div className="absolute inset-0">
                  <Image
                    src={collection.image}
                    alt={collection.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 lg:p-8 text-white relative z-10">
                  {collection.description && (
                    <p className="text-sm text-white/70 mb-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {collection.description}
                    </p>
                  )}
                  <h3 className="font-display text-xl lg:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {collection.name}
                  </h3>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm text-white/80">
                      {collection.productCount ? `${collection.productCount} products` : "Shop Collection"}
                    </span>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 border-white/30 h-auto px-3 py-1.5">
                      {collection.ctaText || "Explore"}
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}