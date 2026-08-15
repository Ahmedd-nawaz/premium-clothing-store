"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  image: string;
  imageAlt: string;
  alignment?: "left" | "center" | "right";
  variant?: "default" | "split" | "overlay";
}

export function HeroBanner({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  image,
  imageAlt,
  alignment = "left",
  variant = "default",
}: HeroBannerProps) {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const textAlignment = {
    left: "",
    center: "mx-auto",
    right: "ml-auto",
  };

  if (variant === "split") {
    return (
      <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl {textAlignment[alignment]} {alignmentClasses[alignment]}">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium uppercase tracking-wider mb-4 animate-fade-in">
              {subtitle}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-primary mb-6 animate-slide-up">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link href={ctaHref}>
                <Button size="lg" className="rounded-full px-8 gap-2">
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {secondaryCtaText && secondaryCtaHref && (
                <Link href={secondaryCtaHref}>
                  <Button variant="outline" size="lg" className="rounded-full px-8 bg-background border-border">
                    {secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "overlay") {
    return (
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl {textAlignment[alignment]} {alignmentClasses[alignment]}">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium uppercase tracking-wider mb-4 animate-fade-in">
              {subtitle}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-white mb-6 animate-slide-up">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-white/80 mb-8 max-w-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link href={ctaHref}>
                <Button size="lg" variant="secondary" className="rounded-full px-8 gap-2">
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {secondaryCtaText && secondaryCtaHref && (
                <Link href={secondaryCtaHref}>
                  <Button variant="ghost" size="lg" className="rounded-full px-8 text-white border-white/50 hover:bg-white/10">
                    {secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl {textAlignment[alignment]} {alignmentClasses[alignment]} animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium uppercase tracking-wider mb-4">
              {subtitle}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-primary mb-6">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ctaHref}>
                <Button size="lg" className="rounded-full px-8 gap-2">
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {secondaryCtaText && secondaryCtaHref && (
                <Link href={secondaryCtaHref}>
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    {secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden animate-slide-up">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}