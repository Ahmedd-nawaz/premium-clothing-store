"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BrandValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BrandStorySectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  values?: BrandValue[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function BrandStorySection({
  title = "Our Story",
  subtitle = "Crafted with Purpose",
  description = "Founded on the belief that clothing should be both beautiful and responsible. Every piece in our collection tells a story of meticulous craftsmanship, sustainable practices, and timeless design.",
  image,
  imageAlt,
  values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Sustainable Materials",
      description: "We source only the finest organic and recycled fabrics, ensuring minimal environmental impact.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.429 15.429a12.062 12.062 0 00-1.414-5.516l-.354-.353-6.778 6.779-2.475-2.475-.353.354a12.062 12.062 0 000 6.883l6.828 6.828c.457.458 1.199.458 1.657 0l3.54-3.54c.457-.457.457-1.198 0-1.657z" />
        </svg>
      ),
      title: "Ethical Production",
      description: "Every garment is made in certified facilities with fair wages and safe working conditions.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a4 4 0 118 0h-8z" />
        </svg>
      ),
      title: "Timeless Design",
      description: "We create pieces that transcend seasons, focusing on quality over quantity.",
    },
  ],
  ctaText = "Learn More About Us",
  ctaHref = "/about",
  className,
}: BrandStorySectionProps) {
  return (
    <section className={cn("py-16 lg:py-24", className)} aria-labelledby="brand-story-heading">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="max-w-md">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium uppercase tracking-wider mb-4">
                {subtitle}
              </span>
              <h2 id="brand-story-heading" className="font-display text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {description}
              </p>
              <Link href={ctaHref}>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  {ctaText}
                </Button>
              </Link>
            </div>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-border">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          {image && (
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}