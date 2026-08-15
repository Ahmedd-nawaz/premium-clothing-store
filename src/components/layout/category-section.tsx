"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
  productCount?: number;
}

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  categories: CategoryItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  viewAllHref?: string;
  viewAllText?: string;
  className?: string;
}

export function CategorySection({
  title,
  subtitle,
  categories,
  columns = 4,
  viewAllHref,
  viewAllText = "View All Categories",
  className,
}: CategorySectionProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

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
          className={`${columnClasses[columns]} gap-4 lg:gap-6`}
          role="list"
          aria-label={title}
        >
          {categories.map((category) => (
            <article
              key={category.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-muted"
            >
              <Link
                href={`/shop/${category.slug}`}
                className="block h-full w-full"
                aria-label={category.name}
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white relative z-10">
                  <h3 className="font-display text-lg lg:text-xl font-semibold mb-1 group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <p className="text-sm text-white/70">
                      {category.productCount} {category.productCount === 1 ? "product" : "products"}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}